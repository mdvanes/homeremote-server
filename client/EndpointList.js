const template = document.createElement('template');
template.innerHTML = `<div></div>`;

class EndpointList extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const node = template.content.cloneNode(true);

    const endpoints = this.getAttribute('endpoints');

    const div = node.querySelector('div');
    div.innerHTML = endpoints
      .split(',')
      .map((item) => `<endpoint-item name="${item}"></endpoint-item>`)
      .join('');
    shadowRoot.appendChild(node);
  }
}
customElements.define('endpoint-list', EndpointList);

export default EndpointList;
