import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as multer from 'multer';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    const upload = multer({ dest: './uploads' });
    // support application/json type post data
    this.app.use(bodyParser.json());
    //support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(function(req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
      res.setHeader('Access-Control-Allow-Methods', 'POST');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);
      next();
    });
    this.app.get('/api', function(req, res) {
      res.end('ok');
    });
    this.app.post('/api', function(req, res) {
      res.end('File is uploaded');
    });
  }
}

export default new App().app;
