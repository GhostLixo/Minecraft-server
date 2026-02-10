scoreboard players add @a MSeconds 1
scoreboard players add @a[scores={MSeconds=20}] Seconds 1
scoreboard players remove @a[scores={MSeconds=20..}] MSeconds 20
scoreboard players add @a[scores={Seconds=60}] Minutes 1
scoreboard players add @a[scores={Seconds=60}] "Minutes On:" 1
scoreboard players remove @a[scores={Seconds=60..}] Seconds 60
scoreboard players add @a[scores={Minutes=60}] Hours 1
scoreboard players remove @a[scores={Minutes=60..}] Minutes 60
scoreboard players add @a[scores={Hours=24}] Days 1
scoreboard players remove @a[scores={Hours=24..}] Hours 24

tag @a add dead
tag @e[type=player] remove dead
scoreboard players add @a[tag=dead,tag=!counted] deaths 1
scoreboard players set @a[tag=dead,tag=!counted] Killstreak 0
tag @a[tag=dead] add counted
tag @a[tag=!dead] remove counted

scoreboard players set @a Entites 0
execute @e[type=!player] ~~~ scoreboard players add @a Entites 1

scoreboard players set @a PlayersOn 0
execute @e[type=player] ~~~ scoreboard players add @a PlayersOn 1