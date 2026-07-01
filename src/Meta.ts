declare const __APP_VERSION__: string;
declare const __BUILD_DATE__: string;

interface MetaInterface {
  version: string;
  date: string;
}

const meta: MetaInterface = {
  version: __APP_VERSION__,
  date: __BUILD_DATE__,
};
export default meta;
