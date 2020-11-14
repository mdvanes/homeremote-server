const template = document.createElement('template');
template.innerHTML = `
<style>
  main {
    color: #333;
    border: 1px solid #333;
    border-radius: 4px;
    display: inline-block;
    padding: 1rem;
    margin: 0.2rem;
    background-color: #eee;
    box-shadow: 2px 2px #222;
  }
</style>
<main>
  <h1><a href=""></a></h1>
  <button>get</button>
  <div id="result">result</div>
</main>`;

const getSome = (name, resultElem) => () => {
  fetch(`/api/${name}`, {
    method: 'GET',
  })
    .then((data) => data.text())
    .then((data) => {
      console.log(data);
      resultElem.innerHTML = data;
    });
};

class EndpointItem extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const node = template.content.cloneNode(true);

    const name = this.getAttribute('name');

    node.querySelector('a').innerHTML = `/api/${name}`;
    node.querySelector('a').href = `/api/${name}`;

    node
      .querySelector('button')
      .addEventListener('click', getSome(name, node.getElementById('result')));

    shadowRoot.appendChild(node);
  }
}

customElements.define('endpoint-item', EndpointItem);

export default EndpointItem;
