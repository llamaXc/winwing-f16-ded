module.exports = {
  root: true,
  env: {
    node: true,
    jquery: true,
  },
  extends: [
    'plugin:vue/essential',
    'plugin:vue/recommended',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  globals: {
    axios: true,
    gplancal: true,
    Global: true,
    WWTHID_Sync: true,
    WWTHID_send: true,
    MFD_Sync:true,
    MFD_send:true,
    GameExtendDisplay_sync: true,
    GameExtendDisplay_send: true,
    AllDevice: true,
    TestFlow: true,
    Vue: true,
    WWTHID_ON: true,
    WWTHID_removeListener: true,
    _HW_AXIS_INDEX: true,
    HW_AXIS_INDEX: true
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    camelcase: 'off',
    semi: 'off',
    eqeqeq: 'off',
    "vue/require-v-for-key": 'off',
    "vue/attribute-hyphenation": 'off',
    "vue/valid-v-for": 'off'
  }
}