import * as types from '../../constants/ActionTypes'
import { API_URL, USERS } from '../../constants/Routes'

const authRequest = () => {
  return {
    type: types.AUTHENTICATION_REQUEST
  }
}

const authSuccess = (user, token) => {
  return {
    type: types.AUTHENTICATION_SUCCESS,
    user: user,
    token: token
  }
}

const authFailure = errors => {
  return {
    type: types.AUTHENTICATION_FAILURE,
    errors: errors
  }
}

export const signup = user => {
  const newUser = user;
  const request = new Request(USERS, {
    method: 'POST',
    headers: {
      'Accept':'application/json',
      'Content-Type':'application/json',
    },
    body: JSON.stringify({user: user})
  });
  
  return dispatch => {    
    return fetch(request)
      .then(response => {
        if (response.status === 201) {
          return response.json()      
            .then(() => {
              return dispatch(authenticate({
                name: newUser.name,
                email: newUser.email,
                password: newUser.password 
              }));
            })
        } else {
          throw new Error('Failed to signup');
        }
      })
      .catch(errors => {
        dispatch(authFailure(errors))
        return { errors: errors };
      })
  };
}

export const authenticate = credentials => {
  const request = new Request(`${API_URL}/user_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ auth: credentials })
  })
  return dispatch => {
    dispatch(authRequest());
    return fetch(request)
      .then(response => {
        console.log(response);
        if (response.status === 201) {
          return response.json()
          .then(json => {
            const token = json.jwt;
            localStorage.setItem('token', token);
            return getUser(credentials)
          })
          .then(user => {
            localStorage.setItem('user', JSON.stringify(user));
            dispatch(authSuccess(user, localStorage.token));
            return user;         
          })
        } else {
          throw new Error('Failed to authenticate');
        }
      })
      .catch(errors => {
          dispatch(authFailure(errors));
          localStorage.clear();
          return { errors: errors };
      })
  }
}

export const logout = () => {
  return dispatch => {
    localStorage.clear();
    return dispatch({
      type: types.LOGOUT
    });
  }
}

export const getUser = credentials => {
  const request = new Request(`${API_URL}/find_user`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.token}`,
    }),
    body: JSON.stringify({user: credentials})
  })

  return fetch(request)
    .then(response => response.json())
    .then(json => {
      return json;
    })
    .catch(error => {
      return error;
    });
}

