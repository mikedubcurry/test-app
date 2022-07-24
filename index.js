require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

const port = process.env.PORT || 8080;

const welcomePage = (loggedIn) => `
<html>
<head>
<title>EC2 Hosted App</title>
</head>
<body>
${
  loggedIn
    ? `
<h1>Welcome</h1>
<a href="/logout">log out</a>
<a href="/dashboard">dashboard</a>
`
    : `
<h1>Who are You??</h1>
<a href="login">log in</a>
`
}
</body>
</html>
`;

/**
 *
 * @param {Number[]} data
 * @returns
 */
const dashboardPage = (data) => `
<html>
<head>
<title>Dashboard</title>
</head>
<body>
<h1>Dashboard</h1>
<a href="/">home</a>
<p>lots of data</p>
<ul>
${data
  .map(
    (d) => `
<li>$ ${d.toFixed(2)}</li>
`
  )
  .join("")}
</ul>
</body>
</html>
`;

const data = [];

if (data.length === 0) {
  for (let i = 0; i < 5; i++) {
    data.push(
      (() => {
        let a = Math.random() * 99;
        return a - (a % 0.01);
      })()
    );
  }
}

app.get("/", (req, res) => {
  const loggedIn = req.cookies["logged-in"];
  const page = welcomePage(loggedIn);

  res.write(page);
  res.end();
});

app.get("/login", (req, res) => {
  res.cookie("logged-in", true, { maxAge: 100000, path: "/" });
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  res.cookie("logged-in", null, { maxAge: 0 });
  res.redirect("/");
});

app.use((req, res, next) => {
  if (!req.cookies["logged-in"]) {
    return res.redirect("/");
  }
  next();
});

app.get("/dashboard", (req, res) => {
  res.write(dashboardPage(data));
  res.end();
});

app.listen(port);
