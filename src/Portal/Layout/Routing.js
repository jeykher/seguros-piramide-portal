import React from "react"
import { Router } from "@reach/router"

/* seguridad */
import PasswordChange from 'Portal/Views/Security/PasswordChange'
import SubUsers from "../Views/Security/SubUsers/SubUsers"
import SubUserForm from "../Views/Security/SubUsers/SubUserForm"
import Profiles from "../Views/Security/profiles/Profiles"
import UnlockUser from "../Views/Security/UnlockUsers/UnlockUser"
import PasswordChangeUsers from "../Views/Security/PasswordChangeUsers/PasswordChangeUsers"

/*workflow*/
import TimelineWf from 'Portal/Views/Workflow/TimelineWf'
import ServiceWf from 'Portal/Views/Workflow/ServiceWf'
import ProcedureWf from 'Portal/Views/Workflow/ProcedureWf'

import NotesWf from 'Portal/Views/Workflow/Notes/NotesWf'
import TextAditionalReport from  'Portal/Views/Workflow/Notes/TextAditionalReport'
import CorporateNotesWf from 'Portal/Views/Workflow/Notes/CorporateNotesWf'
import ChatWf from 'Portal/Views/Workflow/Chats/ChatWf'


/*Documents Manage */
import DigitizationWf from 'Portal/Views/Digitization/DigitizationWf'
import DigitizationView from 'Portal/Views/Digitization/DigitizationView'
import DocumentsWf from 'Portal/Views/Workflow/Documents/DocumentsWf'
import RequestDocuments from "Portal/Views/Digitization/RequestDocuments"


/*siniestros salud*/
import ProveedoresSalud from "Portal/Views/Home/ProveedoresSalud"
import VerificationEmergency from 'Portal/Views/HealthClaims/Emergency/VerificationEmergency'
import VerificationsPending from 'Portal/Views/HealthClaims/Emergency/VerificationsPending'
import RequestEntry from 'Portal/Views/HealthClaims/Emergency/RequestEntry'
import RequestExtensionCoverageWf from 'Portal/Views/HealthClaims/Emergency/RequestExtensionCoverageWf'
import RequestEgressWf from 'Portal/Views/HealthClaims/Emergency/RequestEgressWf'
import RequestLetterGuarantee from 'Portal/Views/HealthClaims/LetterGuarantee/RequestLetterGuarantee'
import RequestMedicalAttention from 'Portal/Views/HealthClaims/MedicalAttention/RequestMedicalAttention'
import UpdateDiagnosisWf from 'Portal/Views/HealthClaims/MedicalAttention/UpdateDiagnosisWf'
import VerificationLetterGuarantee from 'Portal/Views/HealthClaims/LetterGuarantee/VerificationLetterGuarantee'
import RequestServiceAsInsured from 'Portal/Views/HealthClaims/RequestServiceAsInsured'
import RequestApproval from "../Views/HealthClaims/Approvals/RequestApproval"
import RequestServiceAsBroker from 'Portal/Views/HealthClaims/RequestServiceAsBroker'
import RequestRefundAccount from "../Views/HealthClaims/Refund/RequestRefundAccount"

/*Siniestros auto*/
import InsuredHome from "Portal/Views/Home/InsuredHome"
import AutoClaimsDeclaration from "Portal/Views/AutoClaims/AutoClaimsDeclaration"
import DeclarationAgreement from "../Views/AutoClaims/DeclarationAgreement"
import TransitDeclaration from "Portal/Views/TransitDeclaration/TransitDeclarationController"

/*remesas*/
import GenerateConsignment from 'Portal/Views/Consignment/Generate/GenerateConsignment'
import SelectProviderForConsignment from 'Portal/Views/Consignment/Generate/SelectProviderForConsignment'
import ConsignmentsList from 'Portal/Views/Consignment/ConsignmentsList'

/*dispositivos satelitales*/
import ProviderGpsDevice from 'Portal/Views/Home/ProviderGpsDevice'
import Billing from 'Portal/Views/GpsDevice/Billing/Billing'
import BillingWf from 'Portal/Views/GpsDevice/Billing/BillingWf'
import HomeAdmin from 'Portal/Views/Home/HomeAdmin'
import Agenda from "Portal/Views/GpsDevice/Agenda"
/*cotizaciones*/
import BudgetInit from 'Portal/Views/Budget/BudgetInit'
import BudgetInitCorporate from 'Portal/Views/Budget/BudgetInitCorporate'
import BudgetController from 'Portal/Views/Budget/BudgetController'
import BudgetSMESInit from 'Portal/Views/Budget/BudgetSMES/BudgetSMESPortal'
import DomiciliationSuccess from '../Views/Pays/DomiciliationSuccess'
import WorkingGroups from 'Portal/Views/Budget/BudgetAdjustments/WorkingGroups'

import HealthCareAdminHome from 'Portal/Views/Home/HealthCareAdminHome'
import ConsignmentWf from 'Portal/Views/Consignment/ConsignmentWf'

/*Portal empleados*/
import HomeEmployees from 'Portal/Views/Home/HomeEmployees'
import OperatorView from 'Portal/Views/Panel/PanelOperator'


/*Polizas */
import Policy from 'Portal/Views/Policies/Policy'
import PolicyCancel from 'Portal/Views/Policies/PolicyCancel'
import Customers from 'Portal/Views/Policies/Customers/Customers'
import Customer from 'Portal/Views/Policies/Customers/Customer'
import PolicyModifyPay from 'Portal/Views/Policies/PolicyModifyPay'
import Policies from 'Portal/Views/Policies/Policies'

/*Pagos*/
import Payments from "Portal/Views/OnlinePayments/Payments"
import IdentificationToPay from "Portal/Views/OnlinePayments/IdentificationToPay"
import CapitalBank from "Portal/Views/Pays/CapitalBank"
import ProcessCapitalBank from "../Views/Pays/ProcessCapitalBank"

/*Manager*/
import ErrorsLog from 'Portal/Views/Manager/ErrorsLog'
import TablesManager from 'Portal/Views/Manager/TablesManager'
import TableColumnsData from 'Portal/Views/Manager/TableColumnsData'
import RowColumnsData from 'Portal/Views/Manager/RowColumnsData'

/*Portal asesores*/
import HomeAdvisors from 'Portal/Views/Home/HomeAdvisors'
import HistoricalChanges from 'Portal/Views/Advisors/HistoricalChanges/HistoricalChanges'
import AgendaAdvisors from "Portal/Views/Advisors/Agenda/Agenda"
import CommissionsList from "../Views/Advisors/Listings/Commissions/CommissionsList"
import CommissionAdvancesList from "../Views/Advisors/Listings/Commissions/CommissionAdvancesList"
import CashIncomeList from "../Views/Advisors/Listings/CashIncome/CashIncomeList"
import Renovations from "../Views/Advisors/Listings/Renovations/Renovations"
import ManagementAdvisor from 'Portal/Views/Advisors/Management/ManagementAdvisors'

//Colaboradores y asistentes
import Allies from 'Portal/Views/Advisors/Allies/Allies'

/*Historical Services by Profile*/
import HistoryServices from 'Portal/Views/HistoryServices/HistoryServices'
import HistoryServicesHealthCare from 'Portal/Views/HealthClaims/HistoryServicesHealthCare'

/*Transacciones*/
import HistoryTransactions from 'Portal/Views/Pays/Transactions/HistoryTransactions'
import ReceiptsList from "../Views/Advisors/Listings/Receipts/ReceiptsList"
import RefundSettlements from "../Views/Advisors/Listings/Settlements/RefundSettlements"

/*Perfil*/
import Settings from 'Portal/Views/Settings/Settings'


/* Reportes */
import ReportGenerate from 'Portal/Views/Reports/ReportGenerate'

/*Financiamientos*/
import EmitFinancing from 'Portal/Views/Financing/EmitFinancing/EmitFinancing'
import SearchFinancing from 'Portal/Views/Financing/SearchFinancing/SearchFinancing'
import BudgetFinancing from 'Portal/Views/Financing/BudgetFinancing/BudgetFinancing'
/*Fianzas*/
import GuaranteeRequest from 'Portal/Views/Guarantee/GuaranteeRequest'

/*Portal Supervisor*/
import HomeSupervisors from 'Portal/Views/Home/HomeSupervisors'
import JobGroups from 'Portal/Views/Supervisors/jobGroups/JobGroups'
import ProfileConfiguration from "Portal/Views/Supervisors/SettingProfileUsers/ProfileUsers"
import SupervisorView from 'Portal/Views/Panel/PanelSupervisor';
import PresidentView from 'Portal/Views/Panel/PanelPresident';
import TeamManagement from 'Portal/Views/Supervisors/management/TeamManagement'
/*Formularios*/
import LayoutGenerate from "../Views/Forms/LayoutGenerate"

/*Download Zone*/
import ManageDocuments from "../Views/DownloadZone/Documents/ManageDocuments"
import ManageDirectories from "../Views/DownloadZone/Directories/ManageDirectories"
import DownloadDocuments from "../Views/DownloadZone/Documents/DownloadDocuments"

import TaxReceipts from "../Views/Advisors/Listings/TaxReceipts/TaxReceipts"

import ClaimsInquiryTable from "../Views/Advisors/ClaimsInquiry/ClaimsInquiryTable"

/* Commercial manager */
import CommissionListWithAdvisor from "../Views/Advisors/Listings/Commissions/CommissionListWithAdvisor"
import ReceiptsListWithAdvisor from "../Views/Advisors/Listings/Receipts/ReceiptsListWithAdvisor"
import RefundSettlementsWithAdvisor from "../Views/Advisors/Listings/Settlements/RefundSettlementsWithAdvisor"
import RenovationsWithAdvisor from '../Views/Advisors/Listings/Renovations/RenovationsWithAdvisor'
import TaxReceiptsWithAdvisor from '../Views/Advisors/Listings/TaxReceipts/TaxReceiptsWithAdvisor'
import CashIncomeWithAdvisor from '../Views/Advisors/Listings/CashIncome/CashIncomeWithAdvisor'

/* Expediente del asesor */
import AdvisorDetails from '../Views/Advisors/Records/AdvisorDetails'
import AdvisorRequirements from '../Views/Advisors/Records/AdvisorRequirements'

/* Service Notifications */
import ServiceNotificationPage from '../Views/ServiceNotifications/ServiceNotificationPage'
/* Talleres y Repuestos */
import SparePartsProvidersHome from 'Portal/Views/Home/SparePartsProvidersHome'
import VehiclePartsProvidersHomeAdmin from 'Portal/Views/Home/VehiclePartsProvidersHomeAdmin'


import SparePartsProvidersInit from '../Views/SparePartsProviders/SparePartsProvidersInit'
import SparePartsBudget from '../Views/SparePartsProviders/SparePartsBudget'
import SparePartsBudgetDetail from '../Views/SparePartsProviders/SparePartsBudgetDetail'

export default function Routing({restartScroll}) {
    const prefixBasePath = (process.env.GATSBY_PREFIX_SITE) ? process.env.GATSBY_PREFIX_SITE : ""
    return (
        <Router basepath={prefixBasePath + "/app"}>
            {/*security*/}
            <PasswordChange path="/seguridad/cambiar_clave" />
            <SubUserForm path="/seguridad/agregar_sub_usuario" />
            <SubUsers    path="/seguridad/usuarios" />
            <Profiles    path="/seguridad/perfiles" />
            <UnlockUser  path="/seguridad/desbloquear_usuario" />
            <PasswordChangeUsers path="/seguridad/cambio_clave_usuarios" />

            {/*workflow*/}
            <TimelineWf path="/workflow/timeline/:id" />
            <ServiceWf path="/workflow/service/:id/:id_message" />
            <ServiceWf path="/workflow/service/:id/" />
            <ProcedureWf path="/workflow/procedure/:workflow_id/:program_id/:task_id" />
            <NotesWf path="/workflow/notes/:workflow_id" />
            <TextAditionalReport path="/workflow/text_aditional_report/:workflow_id" />
            <CorporateNotesWf path="/workflow/corporate_notes/:workflow_id" />
            <ChatWf path="/workflow/chats/:workflow_id" />
            <RequestApproval path="/workflow/aprobacion/:workflow_id/:program_id" />

            {/*documents*/}
            <DigitizationWf path='/workflow/digitization/:workflow_id/:program_id' />
            <DigitizationView path='/digitization/view/' />
            <DocumentsWf path="/workflow/documents/:workflow_id/" />
            <DocumentsWf path="/workflow/documents/:workflow_id/:program_id" />
            <RequestDocuments path="/workflow/documentos/solicitud/:workflow_id/:program_id" />

            {/*health care claims*/}
            <ProveedoresSalud path="/home_proveedores_salud" />
            <VerificationEmergency path="/siniestro_salud/verificacion_emergencia/:id" />
            <VerificationsPending path="/siniestro_salud/emergencias_pendientes" />
            <RequestEntry path="/siniestro_salud/solicitud_ingreso/:id" />
            <RequestExtensionCoverageWf path="/siniestro_salud/solicitud_extension/:workflow_id/:program_id" />
            <RequestEgressWf path="/siniestro_salud/solicitud_egreso/:workflow_id/:program_id" />
            <RequestLetterGuarantee path="/siniestro_salud/solicitud_carta_aval/:id" />
            <RequestMedicalAttention path="/siniestro_salud/solicitud_ingreso_amp/:id" />
            <UpdateDiagnosisWf path="/siniestro_salud/diagnostico_amp/:workflow_id/:program_id" />
            <VerificationLetterGuarantee path="/siniestro_salud/verificacion_carta/:p_preadmission_id/:p_complement_id" />
            <HistoryServicesHealthCare path="/siniestro_salud/historico_servicios" />
            <RequestServiceAsInsured path="/siniestro_salud/solicitud_servicio_asegurado/:serviceType/:clientCode/:verificationId" />
            <RequestServiceAsInsured path="/siniestro_salud/solicitud_servicio_asegurado/:serviceType/:verificationId" />
            <RequestServiceAsBroker path="/siniestro_salud/solicitud_servicio_asesor/:serviceType/:verificationId" />
            <RequestServiceAsBroker path="/siniestro_salud/solicitud_servicio_empleado/:serviceType/:verificationId" />
            <RequestRefundAccount path="/siniestro_salud/reembolso/:workflow_id/:program_id"/>


            {/*insured*/}
            <InsuredHome path="/home_asegurado" />
            <HistoryServices path="/asegurado/historico_servicios" />
            {/*auto claims*/}
            <AutoClaimsDeclaration path="/asegurado/declaracion_siniestros" />
            <DeclarationAgreement path="/asegurado/declaracion_siniestros/declaration/:declarationNumber/:workflowId/:status/:daysdecla" />
            <TransitDeclaration path="/declaraciones/transporte_terrestre/:policyId" />

            {/*gps devices managment*/}
            <ProviderGpsDevice path="/home_proveedor_satelital" />
            <Billing path="/dispositivo_satelital/facturar/" />
            <BillingWf path="/dispositivo_satelital/facturar_wf/:workflow_id/:program_id" />
            <ProviderGpsDevice path="/home_proveedor_satelital" />
            <HistoryServices path="/dispositivo_satelital/historico_servicios" />
            <Agenda path="/dispositivo_satelital/agenda/" />

            {/*TablesManager*/}
            <HomeAdmin path="/home_admin" />
            <TablesManager path="/manager/tables" />
            <TableColumnsData path="/manager/table_columns_data/:owner/:table" />
            <RowColumnsData path="/manager/row_columns_data/:owner/:table" />
            <TablesManager path="/manager/tables/:schema" />

            {/*Health Care Admin Provider*/}
            <HealthCareAdminHome path="/home_proveedores_salud_adm" />
            <HistoryServices path="/proveedores_salud_adm/historico_servicios" />

            {/*Consignments*/}
            <GenerateConsignment path="/remesas/remesas_generar/:insuranceArea" />
            <GenerateConsignment path="/remesas/generar_remesa/:insuranceArea/:providerCode" />
            <ConsignmentWf path="/remesas/detalle_remesa/:workflow_id" />
            <SelectProviderForConsignment path="/remesas/generar_remesa_corporativo/:insuranceArea" />
            <ConsignmentsList path="/remesas/consulta_remesa/:insuranceArea" />


            <ErrorsLog path="/errors" />

            {/*employees*/}
            <HomeEmployees path="/home_empleado" />
            <HistoryServices path="/empleados/historico_servicios" />
            <OperatorView path='/panel_operador'/>

            {/*polizas*/}
            <Customers path="/clientes" />
            <Customer path="/cliente/:codcli/:type" />
            <Policy path="/poliza/:policy_id/:certified_id" />
            <PolicyCancel path="/anular_poliza" />
            <PolicyModifyPay path="/modificar_frecuencia_pago"/>
            <Policies path="/polizas" />

            {/*cotizaciones*/}
            <BudgetInit path="/cotizaciones" />
            <BudgetInitCorporate path="/cotizar_corporativo" />
            <BudgetController path="/cotizacion/:id" restartScroll={restartScroll}/>
            <BudgetController path="/cotizacion/workflow/:workflowId" restartScroll={restartScroll}/>
            <BudgetController path="/cotizacion/workflow/:workflowId/:programId" restartScroll={restartScroll}/>
            <BudgetSMESInit path="/cotizar/pyme/:insuranceBrokerCode"/>
            <DomiciliationSuccess path="/domiciliation/success" restartScroll={restartScroll}/>
            <WorkingGroups path="/configurar_montos_cotizacion" />

            {/*Pagos */}
            <Payments path="/pagos" />
            <IdentificationToPay path="/cliente_pagar"/>
            <HistoryTransactions path="/historialpagos"/>
            <CapitalBank path="/capital_bank"/>
            <ProcessCapitalBank path="/procesar/capital/"/>

            {/*Asesor*/}
            <HomeAdvisors path="/home_asesor" />
            <HistoryServices path="/asesor/historico_servicios" />
            <HistoricalChanges path="/asesor/historico_cambios" />
            <AgendaAdvisors path="/asesor/agenda" />
            <CommissionsList path="/asesor/comisiones"/>
            <CommissionAdvancesList path="/asesor/anticipos"/>
            <CashIncomeList path="/asesor/ingresos"/>
            <ReceiptsList path="/asesor/recibos"/>
            <RefundSettlements path="/asesor/finiquitos"/>
            <TaxReceipts path="/asesor/facturas_fiscales"/>
            <Renovations path="/asesor/renovaciones" />
            <ManagementAdvisor path="/asesor/gestion"/>
            <ClaimsInquiryTable path="/asesor/consulta/siniestros" />
            <Allies path="/asesor/colaboradores"/>
            <Allies path="/colaboradores"/>
            <AdvisorDetails path="/asesor/actualizacion_datos"/>
            <AdvisorRequirements path="/asesor/expediente"/>

            {/*Supervisor*/}
            <HomeSupervisors path="/home_supervisor"/>
            <JobGroups path="/grupos_trabajo"/>
            <ProfileConfiguration path="/configuracion_perfil"/>
            <PresidentView path="/panel_presidente"/>
            <SupervisorView path="/panel_supervisor"/>
            <TeamManagement  path="/gestion_supervisor"/>


            {/*Reportes*/}
            <ReportGenerate path="/reportes/generar/:report_id" />

            {/*Financiamientos*/}
            <EmitFinancing path="/financiar"/>
            <SearchFinancing path="/consultarfin"/>
            <SearchFinancing path="/consultarfin/:numfinancing"/>
            <BudgetFinancing path="/cotizarfin"/>

            {/*Guarantee*/}
            <GuaranteeRequest path="/fianzas/solicitud"/>


            {/*Formulario*/}
            <LayoutGenerate path="/formulario/:layout_code" />

            {/*Config User*/}
            <Settings path="/settings"/>

            {/*DownloadZone*/}
            <ManageDocuments path="/descargas/administrar_documentos"/>
            <ManageDirectories path="/descargas/administrar_directorios"/>
            <DownloadDocuments path="/descargas/documentos"/>
            <DownloadDocuments path="/descargas/documentos"/>

            {/* Commercial manager */}
            <CommissionListWithAdvisor path="/gerente/comercial/comisiones"/>
            <ReceiptsListWithAdvisor path="/gerente/comercial/recibos"/>
            <RefundSettlementsWithAdvisor path="/gerente/comercial/finiquitos"/>
            <RenovationsWithAdvisor path="/gerente/comercial/renovaciones"/>
            <TaxReceiptsWithAdvisor path="/gerente/comercial/facturas_fiscales"/>
            <CashIncomeWithAdvisor path="/gerente/comercial/ingresos"/>

            {/* Service Notifications */}
            <ServiceNotificationPage path="/notificacion_de_servicios" />
            {/* Talleres y Repuestos */}
            <SparePartsProvidersHome path="/home_proveedor_repuestos" />
            <SparePartsBudget path="/talleres/cotizaciones_rep/:budgetsStatus" />
            <SparePartsBudgetDetail path="/talleres/cotizacion_rep/:sparePartsBudgetsID" />
            <VehiclePartsProvidersHomeAdmin path="/home_proveedor_repuestos_adm"   />
            <SparePartsProvidersInit path="/talleres/cuadro_cotizaciones/" />
            
            
        </Router>
    )
}
