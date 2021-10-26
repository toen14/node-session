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

// menyimpan session
const sessions = [];

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
        // Generate dan menyimpan session
        const sessionId = Math.random().toString();
        sessions.push({sessionId})

        res.setHeader("set-cookie", [`SESSION_ID=${sessionId};`])
        res.end("Sukses login");
      } else {
        res.end('Gagal login');
      }
    });

    req.on("end", function(){
      res.end("Harus menginput data !");
    });

  } else if (req.url === '/harus-login') { 
    // Parsing cookies
    let cookies = cookieParser(req.headers.cookie ?? '');

    // Validasi apakah user memiliki cookie atau session yang valid
    if (sessions.find((session) => session.sessionId == cookies.SESSION_ID)) {
      res.end("Berahasi akses resourse");
    }

    res.end("Anda belum login");
  }  else {
    res.end("Default !");    
  }
});

const cookieParser = function (cookies) {
  // parsing cookies sehingga menjadi object
  // console.log(cookies) untuk melihat data cookies sebelum diparsing
  let cookiesParser = {}
  cookies = cookies
    .replace(/[;]+/g, ',')
    .replace(/[=]+/g, ':')
    .replace(/\s+/g, '')
  .split(/[:,]+/g);

  for (let i = 0; i <= cookies.length / 2; i++) {
    if (i == 0 || i % 2 == 0) {
      cookiesParser[cookies[i]] = cookies[i + 1];
    }        
  }
  
  return cookiesParser;
}

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