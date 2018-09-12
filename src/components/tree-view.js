import React from 'react'

import {
  buildTree,
  zoomToFit,
  centerRoot,
  centerSelectedPerson,
} from '../helpers/d3'
import profileImage from '../images/profile-image.jpeg'

import '../styles/tree-view.styl'

class TreeView extends React.Component {
  constructor() {
    super()
    this.getTreeData = this.getTreeData.bind(this)
    this.edId = 'c1s6BqGyLKQaq6CO4QmseMo'
    this.anneId = 'c34AmL0LEpquWo2Oo8awO6U'
  }

  componentDidMount() {
    const { svg, zoom, allNodes } = buildTree(() => this.getTreeData(this.props), this.props.onClickPerson)
    if (!!this.props.selectedTreePerson) {
      centerSelectedPerson(svg, zoom, allNodes)
    } else {
      centerRoot(svg, zoom)
    }

    // tree control click listeners
    document.getElementById('zoom-to-fit').addEventListener('click', function() {
      zoomToFit(svg, zoom)
    });

    document.getElementById('center-root').addEventListener('click', function() {
      centerRoot(svg, zoom)
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedTreePerson !== nextProps.selectedTreePerson && !!nextProps.selectedTreePerson) {
      const { svg, zoom, allNodes } = buildTree(() => this.getTreeData(nextProps), this.props.onClickPerson)
      centerSelectedPerson(svg, zoom, allNodes)
    }
  }

  getTreeData(props) {
    const greatGrandparentIds = [
      'c3w0qwaDHVC8WCoYqQMiAUy', // carl
      'c2qU8VuBI9yMOaS2yc0oOOk', // ggma firenzi
      'edanneroot', // give them their own root so they'll be next to each other
      'c41jhoJHEYMouAaO2CsIkCy', // caroline
      'c1rgyOY8YbeeeUE6mmC6gq4' // ed V
    ]
    // TODO: this is gross.
    const rootChildren = greatGrandparentIds.map((id, i) => {
      if (id === 'edanneroot') {
        const ed = props.people.filter(p => p.id === this.edId)[0]
        const anne = props.people.filter(p => p.id === this.anneId)[0]

        return {
          name: '',
          id: 'edanneroot',
          hidden: true,
          no_parent: true,
          children: [this.buildPerson(anne, props), this.buildPerson(ed, props)]
        }
      } else {
        const person = props.people.filter(p => p.id === id)[0]
        const fullPerson = this.buildPerson(person, props)
        fullPerson.no_parent = true
        if (i === 0 || i === greatGrandparentIds.length - 1) fullPerson.children = []
        return fullPerson
      }
    })
    const data = {
      name: '',
      id: 'root',
      hidden: true,
      root: true,
      children: rootChildren
    }

    const spouses = []
    for (let person of props.people) {
      if (person.spouse) {
        spouses.push({
          source: {
            id: person.spouse.id,
            name: person.spouse.name,
          },
          target: {
            id: person.id,
            name: person.name,
          },
        })
      }
    }

    const specialLinks = [
      {
        source: {
          id: greatGrandparentIds[1],
        },
        target: {
          id: this.anneId,
        },
      },
      {
        source: {
          id: greatGrandparentIds[greatGrandparentIds.length - 2],
        },
        target: {
          id: this.edId,
        },
      },

    ]

    return { data, spouses, specialLinks }
  }

  buildPerson(person, props) {
    const personObject = {
      id: person.id,
      name: person.name,
      dob: person.birthday,
      photo: person.image ? person.image.file.url : profileImage,
      children: [],
    }
    // TODO: this is gross.
    if (person.contentfulchildren && ![this.anneId].includes(person.id)) { // exclude Anne or we'll double that tree
      for (let childRelation of person.contentfulchildren) {
        const child = props.people.filter(p => p.id === childRelation.id)[0]

        if (![this.anneId, this.edId].includes(child.id)) {
          personObject.children.push(this.buildPerson(child, props))
          if (child.spouse && ![this.anneId, this.edId].includes(child.spouse.id)) { // exclude Ed and Anne
            const spouse = props.people.filter(p => p.id === child.spouse.id)[0]
            personObject.children.push({
              id: spouse.id,
              name: spouse.name,
              photo: spouse.image ? spouse.image.file.url : profileImage,
              no_parent: true,
              selected: spouse.id === props.selectedTreePerson,
            })
          }
        }
      }
    }
    if (!person.mother && !person.father || ([this.anneId, this.edId].includes(person.id))) personObject.no_parent = true
    if (person.id === props.selectedTreePerson) personObject.selected = true

    return personObject
  }

  render() {
    return (
      <div className='tree-view'>
        <div className='actions'>
          <a id='zoom-to-fit' onClick={() => typeof window !== `undefined` && window.mixpanel.track(`Tree Action Clicked`, {Action: `Zoom to Fit`})}>Zoom to Fit</a>
          <div className='separator'></div>
          <a id='center-root' onClick={() => typeof window !== `undefined` && window.mixpanel.track(`Tree Action Clicked`, {Action: `Center`})}>Center</a>
        </div>
        <div id='graph'></div>
      </div>
    )
  }
}

export default TreeView
