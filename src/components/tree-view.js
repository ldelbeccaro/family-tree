import React from 'react'
import TreeViewCouple from '../components/tree-view-couple'
import TreeViewPerson from '../components/tree-view-person'

const coupleWithChildren = function(peopleById, couple) {
  return (
    <div className='couple'>
      <TreeViewCouple
        key={couple[0]}
        people={peopleById}
        personA={peopleById[couple[0]]}
        personB={peopleById[couple[1]]}
      />
    </div>
  )
}

// {
//   personA: [
//     {spouse: 'spouseA', children: [{personB: [], personC: [{spouse: 'spouseC'}]], divorced: true},
//     {spouse: 'spouseB', children: ['childC']}
//   ]
// }

const TreeView = ({ people, onClickPerson }) => {
  const peopleById = {}
  people.forEach(person => {
    peopleById[person.id] = person
  })

  const initialCouple = [`c1s6BqGyLKQaq6CO4QmseMo`, `c34AmL0LEpquWo2Oo8awO6U`]

  return (
    <div className='tree-view'>
      {coupleWithChildren(peopleById, initialCouple)}
      {/* {people.map(person => {
        return (
          <TreeViewPerson
            key={person.name}
            person={person}
            onClickPerson={onClickPerson}
          />
        )
      })} */}
    </div>
  )
}

export default TreeView
