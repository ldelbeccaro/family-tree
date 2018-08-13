import React from 'react'

import { initDiagram, myDiagram } from '../helpers/tree'
import profileImage from '../images/profile-image.jpeg'

import '../styles/tree-view.styl'

class TreeView extends React.Component {
  componentDidMount() {
    const data = this.props.people.map(person => {
      // n: name, m: mother, f: father, ux: spouse
      const personObject = {
        key: person.id,
        n: person.name,
        b: person.birthday,
        source: person.image ? person.image.file.url : profileImage,
        onNodeClick: () => this.props.onClickPerson(person.id)
      }
      if (person.mother) personObject.m = person.mother.id
      if (person.father) personObject.f = person.father.id
      if (person.spouse) personObject.ux = person.spouse.id

      return personObject
    })

    const selectedItem = this.props.selectedTreePerson
    initDiagram(data, selectedItem);

    // center on select
    if (!!this.props.selectedTreePerson) {
      myDiagram.scrollToRect(myDiagram.findNodeForKey(this.props.selectedTreePerson).actualBounds);
    }

    // diagram control click listeners
    document.getElementById('zoom-to-fit').addEventListener('click', function() {
      myDiagram.zoomToFit();
    });

    document.getElementById('center-root').addEventListener('click', function() {
      myDiagram.scale = 1;
      myDiagram.scrollToRect(myDiagram.findNodeForKey('c1s6BqGyLKQaq6CO4QmseMo').actualBounds);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedTreePerson !== nextProps.selectedTreePerson && !!nextProps.selectedTreePerson) {
      const node = myDiagram.findNodeForKey(nextProps.selectedTreePerson)
      if (node !== null) {
        myDiagram.select(node)
      }
    }
  }

  render() {
    return (
      <div className='tree-view'>
        <div className='actions'>
          <a id='zoom-to-fit' onClick={() => typeof window !== `undefined` && window.mixpanel.track(`Tree Action Clicked`, {Action: `Zoom to Fit`})}>Zoom to Fit</a>
          <div className='separator'></div>
          <a id='center-root' onClick={() => typeof window !== `undefined` && window.mixpanel.track(`Tree Action Clicked`, {Action: `Center Root`})}>Center Root</a>
        </div>
        <div id='go-js-diagram' style={{width: `100%`, height: `600px`}}></div>
      </div>
    )
  }
}

export default TreeView
