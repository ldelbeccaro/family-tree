import React from 'react'

import PersonLink from '../components/person-link'
import profileImage from '../images/profile-image.jpeg'

import '../styles/full-person-profile.styl'

class FullPersonProfile extends React.Component {
  componentDidMount() {
    this.setMaxHeight();
  }

  componentWillReceiveProps() {
    this.setMaxHeight();
  }

  componentDidUpdate() {
    this.scrollToTopOfModal();
    this.setMaxHeight();
  }

  scrollToTopOfModal() {
    // Component did update should trigger whenever the props change.
    // In this case, that indicates that the modal content has changed
    // (switching between the Sign Up and Log In modals, perhaps). We
    // we reposition the user back at the top of the modal.
    const modalContent = document.querySelector(`.modal`);

    // component may have unmounted
    if (modalContent) {
      modalContent.scrollTop = 0;

    }

  }

  setMaxHeight() {
    const modal = document.querySelector(`.modal`);
    if (modal) {
      const rect = modal.getBoundingClientRect();
      const maxHeight = window.innerHeight - rect.top - 100; // 50px of padding at bottom of screen
      modal.style.maxHeight = `${maxHeight}px`;
    }
  }

  render() {
    const person = this.props.person
    const imageUrl = person.image ? person.image.file.url : profileImage
    const ageDiffMs = Date.now() - new Date(person.birthday).getTime();
    const ageDate = new Date(ageDiffMs); // miliseconds from epoch
    const personAge = Math.abs(ageDate.getUTCFullYear() - 1970);
  
    return (
      <div className='full-person-profile'>
        <div className='background' onClick={this.props.onClickClose}></div>
        <div className='modal'>
          <div className='close' onClick={this.props.onClickClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </div>
          <div className='header-section'>
            <img className='image' src={imageUrl} alt='' />
            <div className='section'>
              <h3 className='name'>{person.name}</h3>
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
                    dangerouslySetInnerHTML={{__html: person.address.childMarkdownRemark.html}}
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
                    onClickPerson={this.props.onClickPerson}
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
                    onClickPerson={this.props.onClickPerson}
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
                    onClickPerson={this.props.onClickPerson}
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
                        onClickPerson={this.props.onClickPerson}
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
          <div className='section'>
            <a
              className='view-in-tree'
              onClick={() => this.props.onClickViewTree(person.id)}
            >View in family tree</a>
          </div>
        </div>
      </div>
    )  
  }
}

export default FullPersonProfile
