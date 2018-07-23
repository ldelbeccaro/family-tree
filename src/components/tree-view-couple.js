import React from 'react'

import TreeViewPerson from '../components/tree-view-person'
import TreeViewCouple from '../components/tree-view-couple'

import '../styles/tree-view-couple.styl'

export default ({ people, personA, personB }) => {
  const personAChildren = personA.contentfulchildren.map(child => child.id)
  const personBChildren = personB.contentfulchildren.map(child => child.id)
  const children = Array.from(new Set([...personAChildren, ...personBChildren]))
  const divorced = personA.spouse && personA.spouse.id !== personB.id

  return (
    <div className='tree-view-couple'>
      <div className='couple'>
        <TreeViewPerson person={personA} />
        <div className={`couple-connector ${divorced ? `divorced` : ``}`} />
        <TreeViewPerson person={personB} />
      </div>
      <div className='children'>
        {children.map(childId => {
          const child = people[childId]
          if (child.spouse) {
            return <TreeViewCouple key={`${personA.id}${personB.id}`} people={people} personA={child} personB={people[child.spouse.id]} />
          } else {
            return <TreeViewPerson key={child.id} person={child} />
          }
        })}
      </div>
    </div>
  )
}
