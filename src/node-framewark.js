const express = require('express');
const session = require('express-session');

const port = 8989;
const app = express();

const users = [
  {
    email: "email1@mail.com",
    password: "password1"
  },
  {
    email: "email2@mail.com",
    password: "password2"
  },
];

// perlu diingat harusnya credensial harusnya disimpan di environment variable
// dan password di hashing untuk keamanan
app.use(express.json());
app.use(session({
  name: 'SESSION_ID',
  secret: 'rahsia',
  resave: false,
  saveUninitialized: false,
  cookie:{
    maxAge:10000, // jika cookie sudah lewat 10000 detik maka akan di hapus
    httpOnly: true, // cookie menjadi aman
  }
}));

app.post('/login', (req, res) => {
  const {email, password} = req.body;

  // Mencari imputan user apakah tersedia
  const user = users.find(function(user) {
    return (user.email == email && user.password == password);
  });

  if (user) {
    // Generate session & cookie
    req.session.isLogin = true;
    req.session.save();
    res.end("Sukses login");
  }
  
  res.end('Gagal login');
});

app.all('/harus-login',(req, res) => {
  if(! req.session.isLogin)  res.end("Anda belum login !");

  res.end("Berhasil akses resourse");
});

// Jalankan server
app.listen(port, () =>{
  console.log(`Server berjalan di port ${port}`);
});