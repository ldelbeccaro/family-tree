import React from 'react'

import { initDiagram, myDiagram } from '../helpers/tree'
import profileImage from '../images/profile-image.jpeg'

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
        <a id='zoom-to-fit'>Zoom to Fit</a>
        <a id='center-root'>Center Root</a>
        <div id='go-js-diagram' style={{width: `100%`, height: `600px`}}></div>
      </div>
    )
  }
}

// const TreeView = ({ people, onClickPerson }) => {
//   const initialCouple = [`c1s6BqGyLKQaq6CO4QmseMo`, `c34AmL0LEpquWo2Oo8awO6U`]

//   return (
//     <div className='tree-view'>
//       <div id='go-js-diagram'></div>
//       {/* {coupleWithChildren(peopleById, initialCouple)} */}
//       {/* {people.map(person => {
//         return (
//           <TreeViewPerson
//             key={person.name}
//             person={person}
//             onClickPerson={onClickPerson}
//           />
//         )
//       })} */}
//     </div>
//   )
// }

export default TreeView
