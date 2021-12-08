import { resolve, join } from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import type { IncomingRequest, NextAuthOptions } from 'next-auth';
import type { NextAuthAction } from 'next-auth/lib/types';
import { NextAuthHandler } from 'next-auth/core';
import fetch from 'node-fetch';
import type { Module } from '@nuxt/types';

// @ts-ignore
global.fetch = fetch;

function nextAuthApiRoutesHandler(options: NextAuthOptions) {
  const app = express();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());

  app.get('/auth/*', async (req) => {
    const nextauth = req.url?.split('/');

    const nextRequest: IncomingRequest = {
      host: process.env.NEXTAUTH_URL,
      body: req.body,
      cookies: req.cookies,
      query: req.query,
      headers: req.headers,
      method: req.method,
      action: nextauth?.[1] as NextAuthAction,
      providerId: nextauth?.[2]?.split('?')[0],
      error: nextauth?.[2]?.split('?')[0]
    };

    await NextAuthHandler({
      req: nextRequest,
      options
    });
  });

  app.post('/auth/*', async (req) => {
    const nextauth = req.url?.split('/');

    const nextRequest: IncomingRequest = {
      host: process.env.NEXTAUTH_URL,
      body: req.body,
      cookies: req.cookies,
      query: req.query,
      headers: req.headers,
      method: req.method,
      action: nextauth?.[1] as NextAuthAction,
      providerId: nextauth?.[2]?.split('?')[0],
      error: nextauth?.[2]?.split('?')[0]
    };

    await NextAuthHandler({
      req: nextRequest,
      options
    });
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
  // Inspired by https://github.com/nuxt-community/auth-module/blob/dev/templates/plugin.js
  const runtime = resolve(__dirname, '../client');
  this.options.alias['~auth/runtime'] = runtime;
  this.options.build.transpile?.push(__dirname);
};

export default NextAuthModule;
module.exports.meta = require('../../package.json');
