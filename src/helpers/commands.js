module.exports = {
  findMessage: (commandType, message) => {
    const commandList = message.content.split(commandType);
    const commandValue = commandList[1].toLowerCase();
    return commandValue;
  },
}