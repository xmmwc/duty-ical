import express from 'express'
import calendar, { ICalenderOptions } from './calendar'

interface IServerOptions extends ICalenderOptions {
  port?: number
}

export default (options: IServerOptions) => {
  const app = express()
  const defaultOptions = {
    port: 9090
  }
  const opts = Object.assign({}, defaultOptions, options)

  app.use('/calendar', (req, res, next) => {
    calendar({
      ...opts
    }).then((data) => {
      res.set('content-type', 'text/calendar')
      res.send(data)
    }).catch(err => {
      next(err)
    })
  })

  app.use('/calendar/:name', (req, res, next) => {
    const filter = req.params.name
    console.log(`search for ${filter}`)
    calendar({
      ...opts,
      filter
    }).then((data) => {
      res.set('content-type', 'text/calendar')
      res.send(data)
    }).catch(err => {
      next(err)
    })
  })

  app.use((err, req, res, next) => {
    res.status(500)
    res.json({
      msg: err.message,
      code: 500
    })
  })

  app.listen(opts.port, () => {
    console.log(`server is on ${opts.port}`)
  })
}