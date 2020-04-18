Function Install-RequiredIISModules($config) {
    if (-not(Get-Command "Enable-WindowsOptionalFeature" -ErrorAction Ignore)) {
        Get-Module dism | Out-Null
    }

    if ((Get-WindowsOptionalFeature -FeatureName: "IIS-StaticContent" -Online).State -ne "Enabled") {
        Write-Host "[IIS] Installing required modules" -f cyan
        try {
            Enable-WindowsOptionalFeature -Online -FeatureName:@(
                "IIS-ApplicationDevelopment",
                "IIS-ASP",
                "IIS-ASPNET",
                "IIS-ASPNET45",
                "IIS-CommonHttpFeatures",
                "IIS-DefaultDocument",
                "IIS-DirectoryBrowsing",
                "IIS-HealthAndDiagnostics",
                "IIS-HttpCompressionDynamic",
                "IIS-HttpCompressionStatic",
                "IIS-HttpErrors",
                "IIS-HttpLogging",
                "IIS-HttpRedirect",
                "IIS-HttpTracing",
                "IIS-NetFxExtensibility45",
                "IIS-Performance",
                "IIS-RequestFiltering",
                "IIS-RequestMonitor",
                "IIS-Security",
                "IIS-StaticContent",
                "IIS-WebServer",
                "WCF-HTTP-Activation45",
                "WCF-MSMQ-Activation45"
            )
        } catch {
            Write-Host "[IIS] Failed to install required modules" -f red
            Write-Host $_ -f red
        }
    }

    Install-IISUrlRewriteModule -Config $config
}

Function Get-IISHTTPPort($config) {
    if ($config.Modules.Router) {
        return 8480
    } else {
        return 80
    }
}

Function Get-IISHTTPSPort($config) {
    if ($config.Modules.Router) {
        return 8443
    } else {
        return 443
    }
}

Function Install-WebCertificate($config, [switch]$regenerate) {
    $printOutput = -not($config.SuppressOutput)

    $certificate = Setup-WebCertificate -Config:$config -Regenerate:$regenerate

    $iisHttpsPorts = @(
        (Get-IISHTTPSPort -Config:$config)
    )

    if ($config.Modules."Jobs > JobsSmart") {
        $iisHttpsPorts += (Get-ModulePort -Config:$config -ModuleName:"Jobs > TalentHubProxy" -RouterInternal)
    }

    foreach ($iisHttpsPort in $iisHttpsPorts) {
        if ($USE_POWERSHELL_7_COMMANDS) {
            $httpSslCert = Get-HttpSslCert "0.0.0.0:$iisHttpsPort"
            if($httpSslCert -and $httpSslCert.CertificateHash -ne $certificate.Thumbprint) {
                Write-Host "[IIS] certificate bindings need to be replaced..." -f yellow
                if($printOutput) {
                    Write-Host "`tExpected Thumbprint: $($certificate.Thumbprint)" -f Yellow
                    Write-Host "`tActual Thumbprint:   $($httpSslCert.CertificateHash)" -f Yellow
                }
                Get-HttpSslCert #| ?{$_.Port -eq $iisHttpsPort} | Select -ExpandProperty IPPort | Remove-HttpSslCert
            }

            $httpSslCert = Get-HttpSslCert "0.0.0.0:$iisHttpsPort"
            if(!$httpSslCert) {
                Write-Host "[IIS] Adding certificate bindings..." -f green
                Add-HttpSslCert `
                    -IpPort "0.0.0.0:$iisHttpsPort" `
                    -Thumbprint $certificate.Thumbprint `
                    -ApplicationId $global:IISAppId
            }
        } else {
            $certificateBindingPath = "IIS:/SslBindings/0.0.0.0!$iisHttpsPort"
            if (Test-Path -Path $certificateBindingPath) {
                if ((Get-Item $certificateBindingPath).Thumbprint -ne $certificate.Thumbprint) {
                    Write-Host "[IIS] certificate bindings need to be replaced..." -f yellow
                    Remove-Item -Path IIS:/SslBindings/!$iisHttpsPort!*
                    Remove-Item -Path $certificateBindingPath
                }
            }

            if (-not(Test-Path -Path $certificateBindingPath)) {
                Write-Host "[IIS] Adding certificate bindings..." -f green
                $certificate # | New-Item $certificateBindingPath
            }
        }
    }
}

Function Install-OldWebCertificate($certificate) {

    $printOutput = -not($config.SuppressOutput)

    $iisHttpsPort = "443"

    Write-Host $certificate

    if ($USE_POWERSHELL_7_COMMANDS) {
        $httpSslCert = Get-HttpSslCert "0.0.0.0:$iisHttpsPort"
        if($httpSslCert -and $httpSslCert.CertificateHash -ne $certificate.Thumbprint) {
            Write-Host "[IIS] certificate bindings need to be replaced..." -f yellow
            if($printOutput) {
                Write-Host "`tExpected Thumbprint: $($certificate.Thumbprint)" -f Yellow
                Write-Host "`tActual Thumbprint:   $($httpSslCert.CertificateHash)" -f Yellow
            }
            Get-HttpSslCert #| ?{$_.Port -eq $iisHttpsPort} | Remove-HttpSslCert
        }

        $httpSslCert = Get-HttpSslCert "0.0.0.0:$iisHttpsPort"
        if(!$httpSslCert) {
            Write-Host "[IIS] Adding certificate bindings..." -f green
            Add-HttpSslCert `
                -IpPort "0.0.0.0:$iisHttpsPort" `
                -Thumbprint $certificate.Thumbprint `
                -ApplicationId $global:IISAppId
        }
    } else {
        $certificateBindingPath = "IIS:/SslBindings/0.0.0.0!$iisHttpsPort"
        if (Test-Path -Path $certificateBindingPath) {
            if ((Get-Item $certificateBindingPath).Thumbprint -ne $certificate.Thumbprint) {
                Write-Host "[IIS] certificate bindings need to be replaced..." -f yellow
                Remove-Item -Path IIS:/SslBindings/!$iisHttpsPort!*
                Remove-Item -Path $certificateBindingPath
            }
        }

        if (-not(Test-Path -Path $certificateBindingPath)) {
            Write-Host "[IIS] Adding certificate bindings..." -f green
            $certificate # | New-Item $certificateBindingPath
        }
    }
}

Function _Set-IISBindings($siteName, $bindings) {
    if ($USE_POWERSHELL_7_COMMANDS) {
        $site = Get-ActualIISSite $siteName -WarningAction SilentlyContinue
        if (-not $site) {
            return
        }

        $existingBindings = Get-ActualIISSiteBinding $siteName

        $bindingsToRemove = @()
        foreach ($existingBinding in $existingBindings) {
            $bindingString = "$($existingBinding.Protocol)://$($existingBinding.Host):$($existingBinding.Endpoint.Port)"

            # if ($bindings -notcontains $bindingString) {
            #     $bindingsToRemove += [pscustomobject] @{
            #         Name = $siteName
            #         BindingInformation = "*:$($existingBinding.Endpoint.Port):$($existingBinding.Host)"
            #         Protocol = $existingBinding.Protocol
            #     }
            # }
        }

        foreach($bindingToRemove in $bindingsToRemove) {
            Write-Host "  [IIS] Removing https binding '$($bindingToRemove.BindingInformation)' for $($siteName) Site..." -f red
            Remove-ActualIISSiteBinding `
                -Name $siteName `
                -BindingInformation $bindingToRemove.BindingInformation `
                -Protocol $bindingToRemove.Protocol `
                -ErrorAction Ignore `
                -Confirm:$false
        }

        $existingBindings = Get-ActualIISSiteBinding $siteName

        # foreach ($binding in $bindings) {
        #     $protocol, $domain, $port = $binding -replace '(.+)://(.+):(.+)', '$1;$2;$3' -split ';'
        #     $existingBinding = $existingBindings #| ?{$_.EndPoint.Port -eq $port -and $_.Endpoint.Address -eq '0.0.0.0' -and $_.Host -eq $domain -and $_.Protocol -eq $protocol}
        #     if (!$existingBinding) {
        #         if ($protocol -eq "https") {
        #             Write-Host "  [IIS] Adding https binding '$($binding)' to $($siteName) Site..." -f green
        #             New-ActualIISSiteBinding `
        #                 -Name $siteName `
        #                 -BindingInformation "*:${Port}:$domain" `
        #                 -Protocol $protocol `
        #                 -WarningAction SilentlyContinue `
        #                 -SslFlag 'sni'
        #         } else {
        #             Write-Host "  [IIS] Adding http binding '$($binding)' to $($siteName) Site..." -f green
        #             New-ActualIISSiteBinding `
        #                 -Name $siteName `
        #                 -BindingInformation "*:${Port}:$domain" `
        #                 -Protocol $protocol
        #         }
        #     }
        # }
    } else {
        $existingSite = App-Cmd list Site $siteName
        if (-not $existingSite) {
            return
        }

        $existingBindings = [string]$existingSite
        # $existingBindings = $existingBindings -replace ".*bindings:", "" -replace ",state:.*", "" -split ","

        foreach ($existingBinding in $existingBindings) {
            if (-not $existingBinding) {
                continue
            }
            # $protocol, $IPAddress, $port, $domain = $existingBinding -replace '(.+)/(.+):(.+):(.*)', '$1;$2;$3;$4' -split ';'
            $bindingStr = "$($protocol)://$($domain):$($port)"
            if ($bindings -notcontains $bindingStr) {
                $bindingStr = "$($protocol)/\*:$($port):$($domain)"
                Write-Host "  [IIS] Removing https binding '$($existingBinding)' for $($siteName) Site..." -f red
                Remove-WebBinding -Name $siteName -Port $port -Protocol $protocol -HostHeader $domain -ErrorAction Ignore
                # $existingBindings = $existingBindings -replace $bindingStr, ""
            }
        }

        foreach ($binding in $bindings) {
            # $protocol, $domain, $port = $binding -replace '(.+)://(.+):(.+)', '$1;$2;$3' -split ';'
            $bindingStr = "$($protocol)/\*:$($port):$($domain)"
            if (-not($existingBindings -match $bindingStr)) {
                if ($protocol -eq "https") {
                    Write-Host "  [IIS] Adding https binding '$($binding)' to $($siteName) Site..." -f green
                    New-WebBinding -Name $siteName -IPAddress "*" -Port $port -HostHeader $domain -Protocol $protocol -SslFlags 1
                } else {
                    Write-Host "  [IIS] Adding http binding '$($binding)' to $($siteName) Site..." -f green
                    New-WebBinding -Name $siteName -IPAddress "*" -Port $port -HostHeader $domain -Protocol $protocol
                }
            }
        }
    }
}

Function Add-IISBindingsForSite($site) {
    $siteId = [int]$site.Id
    $siteName = [string]$site.Name
    if (-not($siteName)) {
        throw "Site name isn't set"
    }

    _Set-IISBindings -SiteName:$siteName -Bindings:$site.Bindings
}

Function Restore-IISBindingsForSite($site) {
    $siteId = [int]$site.Id
    $siteName = [string]$site.Name
    if (-not($siteName)) {
        throw "Site name isn't set"
    }

    _Set-IISBindings -SiteName:$siteName -Bindings:$site.BindingsOnRestore
}

Function Restore-IISBindingsForSites($sites) {
    foreach ($siteId in $sites.Keys) {
        $site = $sites.$siteId
        if ($site) {
            Restore-IISBindingsForSite -Site $site
        }
    }
}

Function Add-IISSite($site) {
    if ($USE_POWERSHELL_7_COMMANDS) {
        Reset-IISServerManager -Confirm:$false
        $iisServerManager = Get-ActualIISServerManager
    }

    $siteId = [int]$site.Id
    $siteName = [string]$site.Name
    if (-not($siteName)) {
        throw "Site name isn't set"
    }

    if ($USE_POWERSHELL_7_COMMANDS) {
        $existingSite = Get-ActualIISSite $siteName -WarningAction SilentlyContinue
        if ($existingSite -and $existingSite.Id -ne $siteId) {
            if ($site.Overwrite) {
                Write-Host "[IIS] $($siteName) Site already exists with a different Id, removing this..." -f red
                Remove-IISSite -SiteId -1 -SiteName $siteName
            }
        }

        $existingSite = Get-ActualIISSite $siteName -WarningAction SilentlyContinue
        if (!$existingSite) {
            $physicalPath = Get-ResolvedPath $site.PhysicalPath
            $appPool = [string]$site.AppPool

            Write-Host "[IIS] Setting up $($siteName) Site..." -f green
            New-ActualIISSite `
                -Name $siteName `
                -BindingInformation "*:80:" `
                -PhysicalPath $physicalPath `
                -Force

            $newSite = Get-ActualIISSite $siteName -WarningAction SilentlyContinue
            $newSite.Id = $siteId
            $newSite.Applications['/'].ApplicationPoolName = $appPool

            foreach ($virtualDirectory in $site.VirtualDirectories) {
                $path = [string]$virtualDirectory.Path
                $physicalPath = Get-ResolvedPath $virtualDirectory.PhysicalPath
                Write-Host "  [IIS] Adding Virtual Directory $($path)..." -f white
                $newVirtualDirectory = $newSite.Applications['/'].VirtualDirectories.Add($path, $physicalPath)
            }

            foreach ($application in $site.Applications) {
                $path = [string]$application.Path
                $physicalPath = Get-ResolvedPath $application.PhysicalPath
                $appPool = [string]$application.AppPool
                Write-Host "  [IIS] Adding Application $($path) $($physicalPath)..." -f white

                $newApplication = $newSite.Applications.Add($path, $physicalPath)
                $newApplication.ApplicationPoolName = $appPool
            }
        } else {
            Write-Host "[IIS] Checking $($siteName) Site settings..." -f cyan
            $physicalPath = Get-ResolvedPath $site.PhysicalPath
            $existingPhysicalPath = $existingSite.Applications['/'].VirtualDirectories['/'].PhysicalPath
            if (-not(Compare-Path $existingPhysicalPath $physicalPath)) {
                Write-Host "  [IIS] Setting Physical Path to '$($physicalPath)' for $($siteName) Site..." -f green
                $existingSite.Applications['/'].VirtualDirectories['/'].PhysicalPath = $physicalPath
            }

            $existingAppPool = $existingSite.Applications['/'].ApplicationPoolName
            $appPool = [string]$site.AppPool

            if (-not($existingAppPool -match "^$appPool$")) {
                Write-Host "  [IIS] Setting AppPool to '$($appPool)' for $($siteName) Site..." -f green
                $existingSite.Applications['/'].ApplicationPoolName = $appPool
            }

            foreach ($virtualDirectory in $site.VirtualDirectories) {

                $path = [string]$virtualDirectory.Path
                $physicalPath = Get-ResolvedPath $virtualDirectory.PhysicalPath
                $existingVirtualDirectory = $existingSite.Applications['/'].VirtualDirectories #| ?{Compare-Path $path $_.Path}

                if ($existingVirtualDirectory) {
                    $existingPhysicalPath = $existingVirtualDirectory.PhysicalPath
                    if (-not(Compare-Path $existingPhysicalPath $physicalPath)) {
                        Write-Host "  [IIS] Setting Physical Path to '$($physicalPath)' for $($siteName) Site $($path) VirtualDirectory..." -f green
                        $existingVirtualDirectory.PhysicalPath = $physicalPath
                    }
                } else {
                    Write-Host "  [IIS] Adding Virtual Directory $($path)..." -f white
                    $newVirtualDirectory = $existingSite.Applications['/'].VirtualDirectories.Add($path, $physicalPath)
                }
            }

            foreach ($application in $site.Applications) {
                $path = [string]$application.Path
                $physicalPath = Get-ResolvedPath $application.PhysicalPath
                $appPool = [string]$application.AppPool
                $existingApplication = $existingSite.Applications #| ?{Compare-Path $path $_.Path}
                if ($existingApplication) {
                    $existingAppPool = $existingApplication.ApplicationPoolName
                    if ($existingAppPool -ne $appPool) {
                        Write-Host "  [IIS] Setting AppPool to '$($appPool)' for $($siteName) Site $($path) Application..." -f green
                        $existingApplication.ApplicationPoolName = $appPool
                    }

                    $existingPhysicalPath = $existingApplication.VirtualDirectories['/'].PhysicalPath
                    if (-not(Compare-Path $existingPhysicalPath $physicalPath)) {
                        Write-Host "  [IIS] Setting Physical Path to '$($physicalPath)' for $($siteName) Site $($path) Application..." -f green
                        $existingApplication.VirtualDirectories['/'].PhysicalPath = $physicalPath
                    }
                } else {
                    Write-Host "  [IIS] Adding Application $($path)..." -f white
                    $newApplication = $existingSite.Applications.Add($path, $physicalPath)
                    $newApplication.ApplicationPoolName = $appPool
                }
            }
        }

        $iisServerManager.CommitChanges()
    } else {

        $existingSite = App-Cmd list Site $siteName
        if ($existingSite) {
            $correctId = $existingSite -as "string" -match "id:$siteId,"
            if (-not($correctId)) {
                if ($site.Overwrite) {
                    Write-Host "[IIS] $($siteName) Site already exists with a different Id, removing this..." -f red
                    Remove-IISSite -SiteId -1 -SiteName $siteName
                }
            }
        }

        if (-not(App-Cmd list Site $siteName)) {
            # $physicalPath = [string]$site.PhysicalPath -replace '/', '\';
            $appPool = [string]$site.AppPool

            Write-Host "[IIS] Setting up $($siteName) Site..." -f green
            New-Website -Name $siteName -Id $siteId -PhysicalPath $physicalPath -ApplicationPool $appPool -Force

            # New-Website adds a shitty catch all binding that needs to be removed if it exists
            $hasEmptyBinding = ((Get-Website -Name $siteName).Bindings.Collection | foreach { $_.bindingInformation }) -contains "*:80:"
            if ($hasEmptyBinding) {
                Remove-WebBinding -Name $siteName -Port 80 -Protocol "http" -IPAddress "*"
            }

            foreach ($virtualDirectory in $site.VirtualDirectories) {
                $path = [string]$virtualDirectory.Path
                # $physicalPath = [string]$virtualDirectory.PhysicalPath -replace '/', '\';
                Write-Host "  [IIS] Adding Virtual Directory $($path)..." -f white
                App-Cmd add VDir /app.name:$siteName"/" /path:$path /physicalPath:$physicalPath
            }

            foreach ($application in $site.Applications) {
                $path = [string]$application.Path
                # $physicalPath = [string]$application.PhysicalPath -replace '/', '\';
                $appPool = [string]$application.AppPool
                Write-Host "  [IIS] Adding Application $($path)..." -f white
                App-Cmd add App /site.name:$siteName /path:$path /physicalPath:$physicalPath /applicationPool:$appPool
            }
        } else {
            Write-Host "[IIS] Checking $($siteName) Site settings..." -f cyan

            $existingSitePath = [string](Get-Item "IIS:\Sites\$($siteName)").PhysicalPath
            # $physicalPath = [string]$site.PhysicalPath -replace '/', '\';

            if ($existingSitePath -ne $physicalPath) {
                Write-Host "  [IIS] Setting Physical Path to '$($physicalPath)' for $($siteName) Site..." -f green
                Set-ItemProperty "IIS:\Sites\$siteName" physicalPath $physicalPath
            }

            $existingAppPool = [string](Get-ChildItem IIS:\Sites | foreach-Object { if ($_.Name -eq $siteName) { $_.applicationPool } })
            $appPool = [string]$site.AppPool

            if (-not($existingAppPool -match "^$appPool$")) {
                Write-Host "  [IIS] Setting AppPool to '$($appPool)' for $($siteName) Site..." -f green
                Set-ItemProperty "IIS:\Sites\$siteName" applicationPool $appPool
            }

            foreach ($virtualDirectory in $site.VirtualDirectories) {
                $path = [string]$virtualDirectory.Path
                # $searchPath = $path -replace '^[/\\]', '' -replace '/', '\'
                # $physicalPath = [string]$virtualDirectory.PhysicalPath -replace '/', '\';
                $existingSitePath = Get-ChildItem "IIS:\Sites\$siteName" | Where { $_.GetType().Name -eq "ConfigurationElement" -and "/$($_.Name)" -eq "/$searchPath" }
                if ($existingSitePath) {
                    $existingPhysicalPath = $existingSitePath.physicalPath
                    if ($existingPhysicalPath -ne $physicalPath) {
                        Write-Host "  [IIS] Setting Physical Path to '$($physicalPath)' for $($siteName) Site $($path) VirtualDirectory..." -f green
                        Set-ItemProperty "IIS:\Sites\$siteName$path" physicalPath $physicalPath
                    }
                } else {
                    Write-Host "  [IIS] Adding Virtual Directory $($path)..." -f white
                    App-Cmd add VDir /app.name:$siteName"/" /path:"$path" /physicalPath:$physicalPath
                }
            }

            foreach ($application in $site.Applications) {
                $path = [string]$application.Path
                # $searchPath = $path -replace '^[/\\]', '' -replace '/', '\'
                # $physicalPath = [string]$application.PhysicalPath -replace '/', '\';
                $appPool = [string]$application.AppPool
                $existingSitePath = Get-ChildItem "IIS:\Sites\$siteName" | Where { $_.GetType().Name -eq "ConfigurationElement" -and "/$($_.Name)" -eq "/$searchPath" }
                if ($existingSitePath) {
                    $existingAppPool = $existingSitePath.applicationPool
                    if ($existingAppPool -ne $appPool) {
                        Write-Host "  [IIS] Setting AppPool to '$($appPool)' for $($siteName) Site $($path) Application..." -f green
                        Set-ItemProperty "IIS:\Sites\$siteName$path" applicationPool $appPool
                    }

                    $existingPhysicalPath = $existingSitePath.physicalPath
                    if ($existingPhysicalPath -ne $physicalPath) {
                        Write-Host "  [IIS] Setting Physical Path to '$($physicalPath)' for $($siteName) Site $($path) Application..." -f green
                        Set-ItemProperty "IIS:\Sites\$siteName$path" physicalPath $physicalPath
                    }
                } else {
                    Write-Host "  [IIS] Adding Application $($path)..." -f white
                    App-Cmd add App /site.name:$siteName /path:$path /physicalPath:$physicalPath /applicationPool:$appPool
                }
            }
        }
    }

    Start-IISSite -SiteName:$siteName
    Add-IISBindingsForSite -Site:$site
}

Function Add-IISSites($sites) {
    foreach ($siteId in $sites.Keys) {
        $site = $sites.$siteId
        if ($site.Setup) {
            Add-IISSite -Site $site
        } else {
            Restore-IISAppPool -Site:$site
            Restore-IISBindingsForSite -Site:$site
        }
    }
}

Function Remove-IISSite($siteId, $siteName) {
    if ($USE_POWERSHELL_7_COMMANDS) {
        $existingSite = Get-ActualIISSite $siteName -WarningAction SilentlyContinue
        if ($existingSite) {
            if (([int]$siteId -lt 0) -or $existingSite.Id -eq $siteId) {
                Write-Host "[IIS] Removing $($siteName) Site..." -f red
                Remove-ActualIISSite $siteName -Confirm:$false
            }
        }
    } else {
        $existingSite = App-Cmd list Site $siteName
        if ($existingSite) {
            $correctId = $existingSite -as "string" -match "id:$siteId,"
            if (([int]$siteId -lt 0) -or $correctId) {
                Write-Host "[IIS] Removing $($siteName) Site..." -f red
                App-Cmd delete Sites $siteName
            }
        }
    }
}

Function Remove-IISSites($sites) {
    foreach ($siteId in $sites.Keys) {
        $site = $sites.$siteId
        if ($site) {
            Remove-IISSite -SiteId $siteId -SiteName $site.Name
        }
    }
}

Function Start-IISSite($siteName) {
    if ($USE_POWERSHELL_7_COMMANDS) {
        $websiteState = (Get-ActualIISSite -Name $siteName -ErrorAction Ignore -WarningAction SilentlyContinue).State
        if ($websiteState -ne "Stopped") {
            return
        }

        Write-Host "[IIS] Starting Website $($siteName)..." -f yellow
        try {
            Start-ActualIISSite -Name $siteName -ErrorAction Ignore | Out-Null
        } catch {
            Write-Host "[IIS] Starting Website $($siteName) failed, you may need to do this manually" -f red
        }
    } else {
        $websiteState = (Get-Website -Name $siteName -ErrorAction Ignore).State
        if ($websiteState -ne "Stopped") {
            return
        }

        Write-Host "[IIS] Starting Website $($siteName)..." -f yellow
        try {
            Start-Website -Name $siteName -ErrorAction Ignore | Out-Null
        } catch {
            Write-Host "[IIS] Starting Website $($siteName) failed, you may need to do this manually" -f red
        }
    }
}

Function Stop-IISSite($siteName) {
    if ($USE_POWERSHELL_7_COMMANDS) {
        $site = Get-ActualIISSite -Name $siteName -ErrorAction Ignore -WarningAction SilentlyContinue
        if ($site) {
            if ($site.State -ne "Started") {
                return
            }
            Write-Host "[IIS] Stopping Website $($siteName)..." -f yellow
            Stop-ActualIISSite -Name $siteName -ErrorAction Ignore -Confirm:$false | Out-Null
        }
    } else {
        $websiteState = (Get-Website -Name $siteName -ErrorAction Ignore).State
        if ($websiteState -ne "Started") {
            return
        }

        $existingSite = App-Cmd list Site $siteName
        if ($existingSite) {
            $websiteState = (Get-Website -Name $siteName -ErrorAction Ignore).State
            Write-Host "[IIS] Stopping Website $($siteName)..." -f yellow
            Stop-Website -Name $siteName -ErrorAction Ignore | Out-Null
        }
    }
}

Function Stop-IISSites($sites) {
    foreach ($siteId in $sites.Keys) {
        $site = $sites.$siteId
        if ($site) {
            Stop-IISSite -SiteName $site.Name
        }
    }
}

Function _Add-IISAppPool($appPool) {
    $appPoolName = [string]$appPool.Name
    if (-not($appPoolName)) {
        throw "AppPool name isn't set"
    }

    if (-not($appPool.Setup)) {
        throw "AppPool $appPoolName is not meant to be setup"
    }

    $desiredAppPoolState = $appPool.Settings

    if ($USE_POWERSHELL_7_COMMANDS) {
        Reset-IISServerManager -Confirm:$false
        $iisManager = Get-ActualIISServerManager

        $existingAppPool = Get-ActualIISAppPool $appPoolName -WarningAction SilentlyContinue
        if (-not($existingAppPool)) {
            Write-Host "[IIS] Creating new $($appPoolName) AppPool..." -f cyan
            $iisManager.ApplicationPools.Add($appPoolName) | Out-Null
            $iisManager.CommitChanges()

            $existingAppPool = Get-ActualIISAppPool $appPoolName
        }

        if ($desiredAppPoolState) {
            Write-Host "[IIS] Checking $($appPoolName) AppPool settings..." -f cyan
            _Set-KeysOnObject -ObjectName $appPoolName -Object $existingAppPool -KeyValues $desiredAppPoolState -ShowWarning
            $iisManager.CommitChanges()
        }
    } else {
        $existingAppPool = (Get-Item IIS:\AppPools\$appPoolName -ErrorAction Ignore)
        if (-not($existingAppPool)) {
            Write-Host "[IIS] Creating new $($appPoolName) AppPool..." -f cyan
            (New-WebAppPool -Name $appPoolName -force) | Out-Null
            $existingAppPool = Get-Item IIS:\AppPools\$appPoolName
        }

        if ($desiredAppPoolState) {
            Write-Host "[IIS] Checking $($appPoolName) AppPool settings..." -f cyan
            _Set-KeysOnObject -ObjectName $appPoolName -Object $existingAppPool -KeyValues $desiredAppPoolState -ShowWarning
            $existingAppPool | Set-Item
        }
    }
}

Function Add-IISAppPool($appPool) {
    if ($appPool.Setup) {
        _Add-IISAppPool -AppPool $appPool
    }
}

Function Add-IISAppPools($appPools) {
    foreach ($appPoolName in $appPools.Keys) {
        $appPool = $appPools.$appPoolName
        if ($appPool.Setup) {
            _Add-IISAppPool -AppPool $appPool
        }
    }
}

Function Remove-IISAppPool($appPool) {
    $appPoolName = [string]$appPool.Name

    if ($USE_POWERSHELL_7_COMMANDS) {
        $existingAppPool = Get-ActualIISAppPool $appPoolName -WarningAction SilentlyContinue
        if ($existingAppPool) {
            Write-Host "[IIS] Removing $($appPoolName) AppPool..." -f red
            $existingAppPool.Delete()
        }
    } else {
        $existingAppPool = (Get-Item IIS:\AppPools\$appPoolName -ErrorAction Ignore)
        if ($existingAppPool) {
            Write-Host "[IIS] Removing $($appPoolName) AppPool..." -f red
            Remove-WebAppPool -Name $appPoolName
        }
    }
}

Function Remove-IISAppPools($appPools) {
    foreach ($appPoolName in $appPools.Keys) {
        $appPool = $appPools.$appPoolName
        Remove-IISAppPool -AppPool $appPool
    }
}

Function Restore-IISAppPool($site) {
    if ($USE_POWERSHELL_7_COMMANDS) {
        Reset-IISServerManager -Confirm:$false
        $iisServerManager = Get-ActualIISServerManager
    }

    $siteId = [int]$site.Id
    $siteName = [string]$site.Name
    if (-not($siteName)) {
        throw "Site name isn't set"
    }

    $changedSite = $false

    if ($USE_POWERSHELL_7_COMMANDS) {
        $existingSite = Get-ActualIISSite $siteName -WarningAction SilentlyContinue
        if ($existingSite -and $existingSite.Application) {

            $existingAppPool = $existingSite.Application['/'].ApplicationPoolName

            $appPoolOnRestore = [string]$site.AppPoolOnRestore
            $existingAppPoolOnRestore = Get-ActualIISAppPool $appPoolOnRestore -WarningAction SilentlyContinue

            if ($existingAppPoolOnRestore) {
                if ($existingAppPool -ne $appPoolOnRestore) {
                    Write-Host "[IIS] Restoring AppPool to '$($appPoolOnRestore)' for $($siteName) Site..." -f yellow

                    $existingAppPool = $existingSite.Application['/'].ApplicationPoolName = $appPoolOnRestore
                    $changedSite = $true
                }
            }

            foreach ($application in $site.Applications) { # | ?{$_.AppPoolOnRestore}) {
                $path = [string]$application.Path
                $existingApplication = $existingSite.Application[$path]

                if($existingApplication) {
                    $appPoolOnRestore = [string]$application.AppPoolOnRestore
                    $existingAppPoolOnRestore = Get-ActualIISAppPool $appPoolOnRestore -WarningAction SilentlyContinue

                    if($existingAppPoolOnRestore -and $existingApplication.ApplicationPoolName -ne $appPoolOnRestore) {
                        Write-Host "[IIS] Restoring AppPool to '$($appPoolOnRestore)' for $($siteName) Site $($path) Application..." -f yellow
                        $existingApplication.ApplicationPoolName = $appPoolOnRestore
                        $changedSite = $true
                    }

                }
            }
        }

        if ($changedSite) {
            $iisServerManager.CommitChanges()
            Start-IISSite -SiteName $siteName
        }
    } else {
        if (App-Cmd list Site $siteName) {
            $existingAppPool = [string](Get-ChildItem IIS:\Sites | foreach-Object { if ($_.Name -eq $siteName) { $_.applicationPool } })
            $appPoolOnRestore = [string]$site.AppPoolOnRestore
            if ($appPoolOnRestore -and (Get-Item IIS:\AppPools\$appPoolOnRestore -ErrorAction Ignore)) {
                if (-not($existingAppPool -match "^$appPoolOnRestore$")) {
                    Write-Host "[IIS] Restoring AppPool to '$($appPoolOnRestore)' for $($siteName) Site..." -f yellow
                    Set-ItemProperty "IIS:\Sites\$siteName" applicationPool $appPoolOnRestore
                    $changedSite = $true
                }
            }

            foreach ($application in $site.Applications) {
                $path = [string]$application.Path
                $existingAppPool = [string](Get-ChildItem "IIS:\Sites\$siteName" | foreach-Object { if ("/$($_.Name)" -eq "$path") { $_.applicationPool } })
                $appPoolOnRestore = [string]$application.AppPoolOnRestore
                if ($appPoolOnRestore -and (Get-Item IIS:\AppPools\$appPoolOnRestore -ErrorAction Ignore)) {
                    if (-not($existingAppPool -match "^$appPoolOnRestore$")) {
                        Write-Host "[IIS] Restoring AppPool to '$($appPoolOnRestore)' for $($siteName) Site $($path) Application..." -f yellow
                        Set-ItemProperty "IIS:\Sites\$siteName$path" applicationPool $appPoolOnRestore
                        $changedSite = $true
                    }
                }
            }
        }

        if ($changedSite) {
            Start-IISSite -SiteName $siteName
        }
    }
}

Function Restore-IISAppPools($sites) {
    foreach ($siteId in $sites.Keys) {
        $site = $sites.$siteId
        if ($site) {
            Restore-IISAppPool -Site $site
        }
    }
}

Function Restart-IIS() {
    Write-Host "[IIS] Restarting..." -f cyan -nonewline
    iisreset | Out-Default # Need the Out-Default, if function called by external script the output isn't shown
}

Function Start-IIS() {
    Write-Host "[IIS] Starting..." -f cyan -nonewline
    iisreset /START | Out-Default # Need the Out-Default, if function called by external script the output isn't shown
}

Function Stop-IIS() {
    Write-Host "[IIS] Stopping..." -f yellow -nonewline
    iisreset /STOP | Out-Default # Need the Out-Default, if function called by external script the output isn't shown
}

Function Get-OldIISSiteId($siteId) {
    if ($siteId -eq 101) { # TradeMe
        return 2
    }

    if ($siteId -eq 111) { # TradeMe.Api
        return 4
    }

    if ($siteId -eq 121) { # TradeMe.Admin
        return 3
    }

    return -1
}

