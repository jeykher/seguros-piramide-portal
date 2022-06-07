import React from "react"

const Toolbar = (toolbar) => {
  const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY;
 
  const {views, onView, localizer: {messages}, label, onNavigate, view, date} = toolbar;

  const handleGoBack = () => {
    let mDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 1);
    switch(view){
      case 'month':
        onNavigate('prev',new Date(mDate.getFullYear(),mDate.getMonth() -1, 1))
        break;
      case 'agenda':
        onNavigate('prev',new Date(mDate.getFullYear(),mDate.getMonth() -1, mDate.getDate() + 1, 1))
      break;
      case 'week':
        onNavigate('prev',new Date(mDate.getFullYear(),mDate.getMonth(),mDate.getDate() -7, 1))
        break;
      default:
        onNavigate('prev',new Date(mDate.getFullYear(),mDate.getMonth(),mDate.getDate() -1, 1))
        break;
    }
  }

  const handleGoFoward = () =>{
    let mDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 1);
    switch(view){
      case 'month':
        onNavigate('next',new Date(mDate.getFullYear(),mDate.getMonth() +1, 1))
        break;
      case 'agenda':
        onNavigate('next',new Date(mDate.getFullYear(),mDate.getMonth() +1,mDate.getDate() + 1, 1))
        break;
      case 'week':
        onNavigate('next',new Date(mDate.getFullYear(),mDate.getMonth(),mDate.getDate() +7, 1))
        break;
      default:
        onNavigate('next',new Date(mDate.getFullYear(),mDate.getMonth(),mDate.getDate() +1, 1))
        break;
    }
  }

  const viewNamesGroup = messages => {
    let viewNames = views;
    if(viewNames.length > 1) {
      return viewNames.map(name => (
        <button
          type="button"
          key={name}
          className='rbc-active'
          onClick={()=> onView(name)}
          >
            {messages[name]}
          </button>
      ))
    }
  }

  const getToolbarStyles = () => insuranceCompany == 'OCEANICA' ? 'rbc-toolbar oceanica' : 'rbc-toolbar piramide';

  return (
    <div className={getToolbarStyles()}>
      <span className="rbc-btn-group">
        <button
          type="button"
          onClick={() => onNavigate('current', new Date())}
        >
          {messages.today}
        </button>
        <button
          type="button"
          onClick={handleGoBack}
        >
          {messages.previous}
        </button>
        <button
          type="button"
          onClick={handleGoFoward}
        >
          {messages.next}
        </button>
      </span>

      <span className="rbc-toolbar-label">{label}</span>

      <span className="rbc-btn-group">{viewNamesGroup(messages)}</span>
    </div>
  )

};

export default React.memo(Toolbar);

