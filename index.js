const Koa = require("koa");
const Router = require("koa-router");
const logger = require("koa-logger");
const bodyParser = require("koa-bodyparser");
const fs = require("fs");
const path = require("path");
const { init: initDB, Counter, User } = require("./db");

const router = new Router();

const homePage = fs.readFileSync(path.join(__dirname, "index.html"), "utf-8");

// 首页
router.get("/", async (ctx) => {
  ctx.body = homePage;
});

router.get("/api/user", async (ctx) => {
  const { request } = ctx;
  // const users = await User.findAll()
  const num = await User.count();
  console.log('22222222222222', 'user：', num, request.query["id"]);

  ctx.body = await User.findOne({
    where: {
      wx_id: request.query["id"],
    }
  });
})

router.post("/api/addUser", async (ctx)=> {
  const { request } = ctx;
  const { name, role, phone, wx_id } = request.body;

  console.log(ctx, request.body);

  try {
    await User.create({
      name,
      role,
      phone,
      wx_id,
      createAt: new Date(),
    });

    ctx.body = {
      code: 1,
      msg: '保存成功'
    };
  } catch {
    ctx.body = {
      code: 200,
      msg: "保存失败"
    }
  }
  
})

// 更新计数
router.post("/api/count", async (ctx) => {
  const { request } = ctx;
  const { action } = request.body;
  if (action === "inc") {
    await Counter.create();
  } else if (action === "clear") {
    await Counter.destroy({
      truncate: true,
    });
  }

  ctx.body = {
    code: 0,
    data: await Counter.count(),
  };
});

// 获取计数
router.get("/api/count", async (ctx) => {
  const result = await Counter.count();

  ctx.body = {
    code: 0,
    data: result,
  };
});

// 小程序调用，获取微信 Open ID
router.get("/api/wx_openid", async (ctx) => {
  if (ctx.request.headers["x-wx-source"]) {
    ctx.body = ctx.request.headers["x-wx-openid"];
  }
});

const app = new Koa();
app
  .use(logger())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

const port = process.env.PORT || 8017;
async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}
bootstrap();
