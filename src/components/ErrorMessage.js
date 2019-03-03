import React from 'react';

const ErrorMessage = props => {      
  const errorList = () => {
    if (props.errors) {
      return props.errors.map((error, index) => {
        return <li key={index} className='error'> {error} </li>
      });
    };
  }
  
  return ( <ul className='errors-list'>{errorList()}</ul> );
};

export default ErrorMessage;