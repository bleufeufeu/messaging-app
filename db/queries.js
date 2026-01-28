const prisma = require("./prisma");

async function createUser(username, password) {
  try {
    const user = await prisma.user.create({
      data: {
        username: username,
        password: password
      },
    });
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function createChat(users) {
  try {
    const chat = await prisma.chat.create({
      data: {
        name: users.map((user) => user.username).join(", "),
        users: {
          connect: users.map((user) => ({ id: user.id }))
        }
      },
    });
    return chat;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function createMessage(content, userId, chatId) {
  try {
    const message = await prisma.message.create({
      data: {
        content: content,
        userId: userId,
        chatId: chatId
      },
    });

    await prisma.chat.update({
      where: {
        id: chatId
      },
      data: {
        lastupdated: new Date()
      }
    });

    return message;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function returnUserByUsername(username) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function returnUserById(id) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function returnChatById(id) {
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: id,
      },
    });
    return chat;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function returnMessageById(id) {
  try {
    const chat = await prisma.message.findUnique({
      where: {
        id: id,
      },
    });
    return chat;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function returnAllUsersExceptSelf(userId) {
  try {
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          id: userId
        }
      },
      include: {
        password: false
      }
    });
    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function returnAllChatsByUser(userId) {
  try {
    const result = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        chats: {
          orderBy: { lastupdated: "desc" }
        }
      }
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function returnAllMessagesByChat(chatId) {
  try {
    const result = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      select: {
        name: true,
        users: {
          select: {
            username: true,
          }
        },
        messages: {
          orderBy: { publishedat: "asc" },
          include: {
            User: {
              select: {
                username: true,
              }
            }
          }
        }
      }
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updatePassword(userId, newPassword) {
  try {
    const result = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: newPassword,
      }
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateEditMessage(messageId, content) {
  try {
    const result = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        content: content,
        isedited: true,
      }
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteMessage(messageId) {
  try {
    const result = await prisma.message.delete({
      where: {
        id: messageId,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function checkIfUserInChat(userId, chatId) {
  try {
    const result = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      select: {
        users: {
          where: {
            id: userId,
          }
        }
      }
    });
    if (result.users.length === 0) return false;
    else return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  createUser,
  createChat,
  createMessage,
  returnUserByUsername,
  returnUserById,
  returnChatById,
  returnMessageById,
  returnAllUsersExceptSelf,
  returnAllChatsByUser,
  returnAllMessagesByChat,
  updatePassword,
  updateEditMessage,
  deleteMessage,
  checkIfUserInChat
};
