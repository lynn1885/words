# How to export data
1. open `cmd` in current directory
2. run  `mongoexport -d words -c words -o words.json --jsonArray --pretty`, then you will get a `words.json` file in the current directory, this is your data. backup it yourself.

如果报错可以添加参数`--forceTableScan`
