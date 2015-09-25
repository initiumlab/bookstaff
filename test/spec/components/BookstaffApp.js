'use strict';

describe('BookstaffApp', () => {
  let React = require('react/addons');
  let BookstaffApp, component;

  beforeEach(() => {
    let container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    BookstaffApp = require('components/BookstaffApp.js');
    component = React.createElement(BookstaffApp);
  });

  it('should create a new instance of BookstaffApp', () => {
    expect(component).toBeDefined();
  });
});
