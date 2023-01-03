const Reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        auth: false,
      };
    case 'LOGIN_SUCCESS':
      return {
        auth: action.payload,
      };
    case 'LOGIN_FAILURE':
      return {
        auth: action.payload,
      };
    case 'LOGOUT':
      return {
        auth: false,
      };
    default:
      return state;
  }
};

export default Reducer;
