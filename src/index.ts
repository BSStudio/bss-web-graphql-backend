import koa from 'koa';
import compress from 'koa-compress';
import bodyParser from 'koa-bodyparser';
import {postgraphile, PostGraphileOptions} from 'postgraphile';
import config from "./config";
import {Pool} from 'pg';

const app = new koa();

/******************************************************************************/

app.use(compress({ threshold: 0 }));


app.use(bodyParser());

/******************************************************************************/

const pool = new Pool({
  ...config.database,
})
const postGraphileOptions: PostGraphileOptions = {
  subscriptions: true,
  watchPg: true,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  showErrorStack: "json",
  extendedErrors: ["hint", "detail", "errcode"],
  appendPlugins: [require("@graphile-contrib/pg-simplify-inflector")],
  exportGqlSchemaPath: "schema.graphql",
  graphiql: true,
  enhanceGraphiql: true,
  enableQueryBatching: true,
  legacyRelations: "omit",
  allowExplain: true,
  simpleCollections: "only",
}
const middleware = postgraphile(pool, config.database.schema, postGraphileOptions);
app.use(middleware);

app.listen(config.port, () => {
  console.log(`Server running on port :${config.port}`);
})
