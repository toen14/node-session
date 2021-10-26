const http = require('http');
const httpserver = http.createServer();
const port = 8989;

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

httpserver.on("request", function(req, res){
  if (req.url === '/login' && req.method === 'POST') {   

    req.on("data", function(data){

      // Ubah json menjadi object JS
      data = JSON.parse(data.toString());

      // Mencari imputan user apakah tersedia
      const user = users.find(function(u) {
        return (u.email == data.email && u.password == data.password);
      });

      // Respon handler
      if (user) {
        // Jika berhasil akan meng-emit event request dengan url '/harus-login' (anggap redirect)
        req.url = '/harus-login';
        req.user = data;
        httpserver.emit('request', req, res);
      } else {
        res.end('gagal login');
      }
    });
    
    req.on('end', function () {
      res.end('Harus input data !')
    });

  } else if (req.url === '/harus-login') {
    if (! req.user) {
      req.on("data", function(data){
        // Ubah json menjadi object JS
        data = JSON.parse(data.toString());
  
        // Mencari imputan user apakah tersedia
        const user = users.find(function(u) {
          return (u.email == data.email && u.password == data.password);
        });
  
        // Respon handler
        if (user) {
          res.end("Berhasil akses");
        } else {
          res.end('Belum login');
        }
      })

      req.on('end', function () {
        res.end('Belum login !')
      })

    } else {
      res.end('Berhasil akses !');
    }
    
  }  else {
    res.end("Default !");    
  }
});

// Handdle error khusus event res.end()
process.on('uncaughtException', function (err) {
  if (! err.message == 'write after end') {
    console.log(err);
  }
});

// Jalankan server
httpserver.listen(port, function() {
  console.log(`Server berjalan di port: ${port}`)
});