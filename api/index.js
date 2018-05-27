import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config.dev';
//import promise from 'promise';
//import { resolve } from 'dns';
import users from './users';
import auth from './auth';
import events from './events';
import query from './query';
import meteoquery from './meteoquery';

const app = express();

app.use(bodyParser.json());

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/events', events);
app.use('/api/query', query);
app.use('/api/meteoquery', meteoquery);


const compiler = webpack(webpackConfig);

app.use(webpackMiddleware(compiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    noInfo: true
}));
app.use(webpackHotMiddleware(compiler));


app.get('/*', (req, resp) => {
    resp.sendFile(path.join(__dirname, '../client/public/index.html'));
    // console.log( data);
    //resp.send(data);

});

const server = app.listen(3000, () => {
    console.log('Server is started on 3000 port...');
});
