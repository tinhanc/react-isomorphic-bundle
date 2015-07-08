'use strict'

import Resource from 'koa-resource-router'
import validate from 'parameter'
import parse from 'co-body'
import hashids from 'src/shared/utils/hashids-plus'
import RestAuth from 'src/server/passport/auth/rest-auth'
import db from 'src/server/db'
import nunjucks from 'nunjucks'

const Post = db.posts

export default new Resource('posts', {
  // GET /posts
  index: function *(next) {
    const { start, end } = this.request.query
    if (typeof start !== 'undefined')
      this.body = yield Post.fetch(0, 10, start, end)
    else
      this.body = yield Post.list(0, 10)
  },
  // POST /posts
  create: [ RestAuth, function *(next) {
    let body = yield parse(this)
    const rule = {
      uid: { type: 'string' },
      type: { type: 'string' },
      prop: { type: 'string' },
      startDate: { type: 'date' },
      endDate: { type: 'date' },
      title: { type: 'string' },
      content: { type: 'string' },
      file: {
        required: false,
        type: 'array',
        itemType: 'string',
        rule: {type: 'string', allowEmpty: true}
      }
    }
    const errors = validate(rule, body)
    if (errors) {
      this.type = 'json'
      this.status = 200
      this.body = errors
      return
    }

    try {
      body.closeDate = body.endDate
      body.file = JSON.stringify(body.file)

      const post = yield Post.create(body)
      this.type = 'json'
      this.status = 201
      this.body = hashids.encodeJson(post)
    } catch (err) {
      this.type = 'josn'
      this.status = 200
      this.body = err
    }

  }],
  // GET /posts/:post
  show: function *(next) {
    try {
      const post = yield Post.load(this.params.post)
      this.type = 'json'
      this.status = 200
      this.body = hashids.encodeJson(post)
    } catch (err) {
      this.type = 'josn'
      this.status = 404
    }
  },
  // GET /posts/:post/edit
  edit: function *(next) {
    this.body = 'post'
  },
  // PUT /posts/:post
  update: [ RestAuth, function *(next) {
    let body = yield parse(this)

    const rule = {
      uid: { type: 'string' },
      type: { type: 'string' },
      prop: { type: 'string' },
      startDate: { type: 'date' },
      endDate: { type: 'date' },
      title: { type: 'string' },
      content: { type: 'string' }
    }
    const errors = validate(rule, body)
    if (errors) {
      this.type = 'json'
      this.status = 200
      this.body = errors
      return
    }

    const post = yield Post.update(this.params.post, body)
    this.type = 'json'
    this.status = 201
    this.body = hashids.encodeJson(post)
  }],
  // DELETE /posts/:post
  destroy: [ RestAuth, function *(next) {
    const post = yield Post.delete(this.params.post)
    this.type = 'json'
    this.status = 200
    this.body = hashids.encodeJson(post)
  }]
})
