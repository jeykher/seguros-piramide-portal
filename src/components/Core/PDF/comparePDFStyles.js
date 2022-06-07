import { StyleSheet } from '@react-pdf/renderer';

const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY
const colorBackgroundTitle = insuranceCompany === 'OCEANICA' ? '#47C0B6' : '#CC2229';
const colorFontTitle = 'white';

const comparePDFStyles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Roboto',
    display: 'flex',
    flexDirection: 'column',
    fontSize: 8
  },

  logo: {
    width: 110,
    height: 30
  },

  header:{
    display: 'flex',
    borderBottom: 1,
    borderColor: 'gray',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  headerInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  headerLogo:{
    display: 'flex',
    justifyContent: 'center'
  },

  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },


  planColumn: {
    marginTop: 5
  },


  titleCard: {
    textTransform: 'capitalize',
    textAlign:'center',
    width: '100%',
    fontWeight: 700,
    color: colorFontTitle
  },

  cobertInfo: {
    width: '100%',
    textAlign:'center',
    paddingVertical: 2
  },
  cobertInfoAuto: {
    width: '100%',
    textAlign:'center',
    paddingVertical: 1
  },

  cobertInfoCard: {
    width: '100%',
    textAlign:'center',
    paddingVertical: 0.05
  },

  paymentInfo:{
    textTransform: 'capitalize'
  },

  quotationInfo: {
    color: 'black',
    textTransform: 'capitalize',
  },

  card: {
    border: 1,
    borderColor: 'gray',
    marginBottom: 5
  },

  cardInfo: {
    border: 1,
    borderColor: 'gray',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    justifyContent: 'center',
    marginTop: 5
  },

  cardConditional:{
    border: 1,
    borderColor: 'gray',
    marginBottom: 5,
    width: '100%'
  },

  textCondition:{
    paddingHorizontal: 6,
    paddingVertical: 1,
  },

  textNote:{
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderTop: 2,
    borderColor: 'gray',
  },

  textNoteCondition:{
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingVertical: 10,
  },
  textNoteSection:{
    marginVertical: 2,
    paddingHorizontal: 5,
    width: '100%'
  },

  boldText:{
    fontWeight: 700,
    color: 'black'
  },
  rowLogo:{
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5
  },

  rowDataHeader:{
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center',
    paddingVertical: 2
  },

  rowData: {
    width: '100%',
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },

  rowDataEven: {
    width: '100%',
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    backgroundColor: '#D1D1D1'
  },

  rowAmountPlan: {
    width: '100%',
    height: 35,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderTop: 1,
    borderTopColor: 'gray',
    fontSize: 11,
  },


  rowDataPlan:{
    width: '100%',
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rowDataAge:{
    width: '100%',
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },

  iconAge:{
    width: 8,
    height: 8
  },

  iconTravel:{
    width: 9,
    height: 9
  },

  rowDataPlanEven:{
    width: '100%',
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D1D1D1'
  },

  rowTitlePlan:{
    width: '100%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorBackgroundTitle
  },

  rowDataIcon: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: 1.55
  },

  rowDataIconAuto: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: 0.80
  },

  rowDataAdvisor: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 0.80
  },

  rowDate: {
    display: 'flex',
    flexDirection: 'column',
    color: 'gray',
  },

  wrapperCobert: {
    width: '33%',
    display: 'flex',
    flexDirection: 'column',
  },

  icon:{
    width: 14,
    height: 14
  },
  iconAuto:{
    width: 12,
    height: 12
  },

  amount: {
    fontFamily: 'Roboto Slab',
    fontSize: 12
  },
  wrapperPlan:{
    width: '33%',
    display: 'flex',
    flexDirection: 'column'
  },
  titleTextNote:{
    marginVertical: '3em',
    fontWeight: 700,
    color: 'black'
  },
  textCenterTextNote:{
    textAlign: 'center',
    fontWeight: 700,
    color: 'black'
  },
  rowFootNote:{
    width: '100%',
    paddingVertical: 3.80
  }

})

export default comparePDFStyles;


