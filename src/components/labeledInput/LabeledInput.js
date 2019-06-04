import React from 'react';
import './labeledInput.css';

export const LabeledInput = (props) => (
  <div>
    <label htmlFor={ props.customId }>{ props.label }</label>
    <input
      id={ props.customId }
      disabled={ props.disabled }
      type={ !!props.currency ? 'text' : 'number' }
			onInput={ props.onInputChange }
			value={ props.inputValue }
			onChange={ (event) => event }
      min="0"
    />
  </div>
);
