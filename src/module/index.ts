import { resolve, join } from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import NextAuth, { NextAuthOptions } from 'next-auth';
import fetch from 'node-fetch';
import type { Module } from '@nuxt/types';

// @ts-ignore
global.fetch = fetch;

function nextAuthApiRoutesHandler(options: NextAuthOptions) {
  const app = express();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());

  app.get('/auth/*', (req, res) => {
    const nextauth = req.path.split('/');
    nextauth.splice(0, 2);
    req.query.nextauth = nextauth;

    // @ts-expect-error Format of next-auth
    // req is diff from express
    NextAuth(req, res, options);
  });

  app.post('/auth/*', (req, res) => {
    const nextauth = req.path.split('/');
    nextauth.splice(0, 2);
    req.query.nextauth = nextauth;

    // @ts-expect-error Format of next-auth
    // req is diff from express
    NextAuth(req, res, options);
  });

  return app;
}

const NextAuthModule: Module<Record<any, any>> = function (moduleOptions) {
  // Merge all option sources
  const options = Object.assign(
    {},
    this.options.nextAuth,
    moduleOptions
  ) as NextAuthOptions;

  // Add custom express server middleware
  this.addServerMiddleware({
    path: '/api',
    handler: nextAuthApiRoutesHandler(options)
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
  const runtime = resolve(__dirname, '../client');
  this.options.alias['~auth/runtime'] = runtime;
  this.options.build.transpile?.push(__dirname);
};

export default NextAuthModule;
module.exports.meta = require('../../package.json');
