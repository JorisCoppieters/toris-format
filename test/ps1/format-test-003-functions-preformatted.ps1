Function My-Function1($myawesomevariable1, $myawesomevariable2, [switch]$MY_AWESOME_VARIABLE_3) {

}

    Function MyFunction2() {

}

Function MyFunction3([string] $ThisOne, [guid] $and_that_one) {
#Line Comment 1
    if (-not(Test-Command "DefaultArg" -ErrorAction Ignore)) {
        Test-Command abc | Out-Null #Special Comment
    }

    if ((Test-Command -Arg1 "Param1" -Arg2).State -ne "Enabled") {
        Write-Host "[IIS] Installing required modules" -f cyan
        #Line Comment 2
    }

    AnotherCommand -Arg1 -Arg2:@(
        (Function1 -Test:$test),
                "Entry2",
                "Entry3"
            )

            Test-Command2 `
            -Arg1 $var1 `
            -Arg2="test" `
            /Arg3:$false

}

Function Get-Something($Param) {
    if($a -and $b.AAAA -ne $c.BBB) {
        return 2;
    } else {
        return -1
    }
}