import React from 'react'

import PersonLink from '../components/person-link'
import profileImage from '../images/profile-image.jpeg'

import '../styles/full-person-profile.styl'

export default ({ person, onClickPerson, onClickViewTree, onClickEdit }) => {
  const imageUrl = person.image ? person.image.file.url : profileImage
  const ageDiffMs = Date.now() - new Date(person.birthday).getTime();
  const ageDate = new Date(ageDiffMs); // miliseconds from epoch
  const personAge = Math.abs(ageDate.getUTCFullYear() - 1970);

  return (
    <div className='full-person-profile'>
      <div className='header-section'>
        <img className='image' src={imageUrl} alt='' />
        <div className='section'>
          <h3 className='name'>{`${person.name}${person.maidenName ? ` (${person.maidenName})` : ``}`}</h3>
          <div className='info'>
            <div className='info-header'>Birthday</div>
            <div className='info-value'>{person.birthday}</div>
          </div>
          {!person.deceased && person.birthday &&
            <div className='info'>
              <div className='info-header'>Age</div>
              <div className='info-value'>{personAge}</div>
            </div>
          }
        </div>
      </div>
      <div className='action-section'>
        <a
          className='action'
          onClick={() => onClickViewTree(person.id)}
        >View in family tree</a>
        <div className='separator'></div>
        <a
          className='action'
          onClick={() => onClickEdit(person.id)}
        >Edit info</a>
      </div>
      {!person.deceased &&
        <div className='section'>
          <div className='section-header'>Contact</div>
          <div className='info'>
            <div className='info-header'>Email</div>
            <a href={`mailto:${person.email}`} className='info-value'>{person.email}</a>
          </div>
          <div className='info'>
            <div className='info-header'>Phone</div>
            <div className='info-value'>{person.phone}</div>
          </div>
          {!!person.address &&
            <div className='info'>
              <div className='info-header'>Address</div>
              <div
                className='info-value'
                dangerouslySetInnerHTML={{__html: person.address.childMarkdownRemark.html.replace(`\n`, `<br>`)}}
              />
            </div>
          }
        </div>
      }
      <div className='section'>
        <div className='section-header'>Immediate Family</div>
        <div className='info'>
          <div className='info-header'>Mother</div>
          <div className='info-value'>{
            person.mother ?
              <PersonLink
                person={person.mother}
                onClickPerson={onClickPerson}
              /> : ``
            }
          </div>
        </div>
        <div className='info'>
          <div className='info-header'>Father</div>
          <div className='info-value'>{
            person.father ?
              <PersonLink
                person={person.father}
                onClickPerson={onClickPerson}
              /> : ``
            }
          </div>
        </div>
        <div className='info'>
          <div className='info-header'>Spouse</div>
          <div className='info-value'>{
            person.spouse ?
              <PersonLink
                person={person.spouse}
                onClickPerson={onClickPerson}
              /> : `None`
            }
          </div>
        </div>
        <div className='info'>
          <div className='info-header'>Children</div>
          <div className='info-value'>{
            person.contentfulchildren ?
              person.contentfulchildren.map((child, idx) => (
                <div className='person-link-container' key={child.id}>
                  <PersonLink
                    person={child}
                    onClickPerson={onClickPerson}
                  />
                  {idx !== person.contentfulchildren.length - 1 &&
                    <div className='separator'></div>
                  }
                </div>
              )) : `None`
            }
          </div>
        </div>
      </div>
    </div>
  )
}
