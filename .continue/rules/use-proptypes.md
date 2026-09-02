---
globs: "`*.tsx`"
description: >-
  This rule encourages the use of PropTypes for all React components to enforce
  type checking and improve code clarity.


  **Example:**

  ```typescript

  import React, { PropTypes } from 'react';


  const MyComponent = ({ name, age }) => (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );


  MyComponent.propTypes = {
    name: PropTypes.string.isRequired,
    age: PropTypes.number,
  };

  ```
alwaysApply: false
---

Always use PropTypes when declaring React component properties to ensure type safety and improve code maintainability. PropTypes help catch potential type errors early in development and make your code more robust.