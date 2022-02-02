"use strict";

var splitLines = function splitLines(t) {
  return t.split(/\r\n|\r|\n/);
};

var getCustomCommand = function getCustomCommand(id, command, type) {
  switch (type) {
    case 1:
      return '{id:' + id + ',Command:"' + command + '"},';

    case 2:
      return "Time:1,Riding:{id:FallingSand,Block:" + id + ",TileEntityData:{Command:" + command + "},";
  }

  return "";
};

var getCompiledCommand = function getCompiledCommand(version, commands, des) {
  var lines = splitLines(commands);
  var customCommands = "";

  switch (version) {
    case "1.18.x - 1.14.x":
      customCommands = "summon falling_block ~ ~1 ~ {Time:1,BlockState:{Name:redstone_block},Passengers:[{id:armor_stand,Health:0,Passengers:[{id:falling_block,Time:1,BlockState:{Name:activator_rail},Passengers:[";
      customCommands = customCommands + getCustomCommand("command_block_minecart", "data merge block ~ ~-2 ~ {auto:0}", 1);
      lines.forEach(function (line, index) {
        customCommands = customCommands + getCustomCommand("command_block_minecart", line, 1);
      });

      if (des) {
        customCommands = customCommands + getCustomCommand("command_block_minecart", 'setblock ~ ~1 ~ command_block{auto:1,Command:"fill ~ ~ ~ ~ ~-2 ~ air"}', 1);
        customCommands = customCommands + getCustomCommand("command_block_minecart", 'kill @e[type=command_block_minecart,distance=..1]', 1);
      }

      customCommands = customCommands.substring(0, customCommands.length - 1);
      customCommands = customCommands + "]}]}]}";
      return customCommands;

    case "1.13.x":
      customCommands = "summon falling_block ~ ~1 ~ {BlockState:{Name:stone},Time:1,Passengers:[{id:falling_block,BlockState:{Name:redstone_block},Time:1,Passengers:[{id:falling_block,BlockState:{Name:activator_rail},Time:1,Passengers:[";
      lines.forEach(function (line, index) {
        customCommands = customCommands + getCustomCommand("command_block_minecart", line, 1);
      });

      if (des) {
        customCommands = customCommands + getCustomCommand("command_block_minecart", 'setblock ~ ~ ~1 command_block{Command:"fill ~ ~-3 ~-1 ~ ~ ~ air"}', 1);
        customCommands = customCommands + getCustomCommand("command_block_minecart", "setblock ~ ~-1 ~1 redstone_block", 1);
        customCommands = customCommands + getCustomCommand("command_block_minecart", "kill @e[type=command_block_minecart,distance=..1]", 1);
      }

      customCommands = customCommands.substring(0, customCommands.length - 1);
      customCommands = customCommands + "]}]}]}";
      return customCommands;

    case "1.12.x - 1.11.x":
      customCommands = "summon falling_block ~ ~1 ~ {Block:stone,Time:1,Passengers:[{id:falling_block,Block:redstone_block,Time:1,Passengers:[{id:falling_block,Block:activator_rail,Time:1,Passengers:[";
      lines.forEach(function (line, index) {
        customCommands = customCommands + getCustomCommand("command_block_minecart", line, 1);
      });

      if (des) {
        customCommands = customCommands + getCustomCommand("MinecartCommandBlock", 'setblock ~ ~ ~1 command_block 0 0 {Command:"fill ~ ~-3 ~-1 ~ ~ ~ air"}', 1);
        customCommands = customCommands + getCustomCommand("MinecartCommandBlock", "setblock ~ ~-1 ~1 redstone_block", 1);
        customCommands = customCommands + getCustomCommand("MinecartCommandBlock", "kill @e[type=MinecartCommandBlock,r=1]", 1);
      }

      customCommands = customCommands.substring(0, customCommands.length - 1);
      customCommands = customCommands + "]}]}]}";
      return customCommands;

    case "1.8.x":
      customCommands = "summon FallingSand ~ ~1 ~ {Block:redstone_block,";
      var num = 3 + lines.Count;
      customCommands = customCommands + getCustomCommand("command_block", "fill ~ ~0 ~1 ~ ~-" + num + " ~1 redstone_block", 2);
      customCommands = customCommands + getCustomCommand("command_block", "setblock ~ ~3 ~1 stone", 2);

      if (des) {
        num = 7 + lines.Count;
        customCommands = customCommands + getCustomCommand("command_block", "setblock ~ ~4 ~ command_block 0 replace {Command:fill ~ ~2 ~ ~ ~-" + num + " ~1 air}", 2);
        num = 1;
      } else {
        num = 0;
      }

      lines.forEach(function (line, index) {
        customCommands = customCommands + getCustomCommand("command_block_minecart", line, 2);
      });
      customCommands = customCommands + "Time:1,Riding:{id:FallingSand,Block:stone,Time:1}";

      for (var i = 0; i < 3 + lines.length + num; i++) {
        customCommands = customCommands + "}";
      }

      return customCommands;
  }
};

window.mcCombiner = {
  getCompiledCommand: getCompiledCommand
};