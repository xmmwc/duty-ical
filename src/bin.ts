import commander from 'commander'
import * as dateFns from 'date-fns'
import server from './server'

commander
  .name('duty-ical')
  .version('1.0.0')
  .requiredOption('-n, --names <names...>', 'duty names')
  .option('-p, --port <port>', 'server port', Number, 9090)
  .option('-s, --start <start>', 'start date', String, dateFns.format(Date.now(), 'yyyy-mm-dd'))
  .option('-d, --duration <duration>', 'calendar duration', Number, 365)
  .option('-n, --number <number>', 'number one day', Number, 3)
  .parse(process.argv)

const opts: any = commander.opts()

server(opts)