const { Sequelize, DataTypes } = require("sequelize");

// 从环境变量中读取数据库配置
// 本地开发环境，数据库
const MYSQL_USERNAME = "root", MYSQL_PASSWORD = "12345678", MYSQL_ADDRESS = "localhost:3306";

// 正式线上环境，数据库
// const { MYSQL_USERNAME = "root", MYSQL_PASSWORD = "ZrN4mkJg", MYSQL_ADDRESS = "sh-cynosdbmysql-grp-7xm3uzg2.sql.tencentcdb.com:26397" } = process.env;

const [host, port] = MYSQL_ADDRESS.split(":");

const sequelize = new Sequelize("eye", MYSQL_USERNAME, MYSQL_PASSWORD, {
  host,
  port,
  dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
});

// 定义数据模型
const Counter = sequelize.define("Counter", {
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});

// 定义数据模型
const User = sequelize.define("users", {
  wx_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    comment: '用户微信id',
  },
  name: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  role: {
    type: DataTypes.FLOAT
  }
});

// 数据库初始化方法
async function init() {
  await Counter.sync({ alter: true });


  // 执行同步，force 为true时删除旧表再创建新表
  await User.sync().then(() => {
    console.log('sync ok')
  })
}

// 导出初始化方法和模型
module.exports = {
  init,
  Counter,
  User,
};
