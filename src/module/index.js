import express from 'express';
import cookieParser from 'cookie-parser';
import NextAuth from 'next-auth';
import fetch from 'node-fetch';
import { resolve, join } from 'path';

global.fetch = fetch;

function moduleHandler(options) {
    const app = express();
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(cookieParser());

    app.get('/auth/*', (req, res) => {
        const nextauth = req.path.split('/');
        nextauth.splice(0, 2);
        req.query.nextauth = nextauth;

        NextAuth(req, res, options);
    });

    app.post('/auth/*', (req, res) => {
        const nextauth = req.path.split('/');
        nextauth.splice(0, 2);
        req.query.nextauth = nextauth;

        NextAuth(req, res, options);
    });

    return app;
}

export default function NextAuthModule(moduleOptions) {
    // Merge all option sources
    const options = Object.assign({}, this.options.nextAuth, moduleOptions);

    // TODO: Check providers supplied
    // TODO: Mark composition api as optional

    // Add custom express server middleware
    this.addServerMiddleware({
        path: '/api',
        handler: moduleHandler(options)
    });

    // Add plugin
    const { dst } = this.addTemplate({
        src: resolve(__dirname, '../../templates/plugin.js'),
        fileName: join('nuxt-next-auth/plugin.js'),
        options
    });
    
    this.options.plugins.push(resolve(this.options.buildDir, dst));

    // Transpile and alias auth src
    // Inspirted from https://github.com/nuxt-community/auth-module/blob/dev/templates/plugin.js
    const runtime = resolve(__dirname, '../client')
    this.options.alias['~auth/runtime'] = runtime
    this.options.build.transpile.push(__dirname)
}

module.exports.meta = require('../../package.json');