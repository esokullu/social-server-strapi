module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "bookshelf",
      settings: {
        client: "mysql",
        database: "social-server",
        host: "127.0.0.1",
        port: 3306,
        username: "root",
        password: ""
      },
      options: {
        pool: { 
          min: 0,
          max: 10,
          idleTimeoutMillis: 30000,
          createTimeoutMillis: 30000,
          acquireTimeoutMillis: 30000
        },
        asyncStackTraces: true
      }
    }
  }
});
