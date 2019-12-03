import request from '@/utils/request'


//查询表头状态信息
export  function getStatus() {
  return request({
    url:'/api/organization-service/organization/status-count',
    method:'get',
  })
}

//整体架构预览
export  function getArchitect() {
  return request({
    url:'/api/organization-service/organization/structure-preview',
    method:'get',
  })
}

//根据条件查询组织机构列表信息（驳回）

export  function getRejectList(data) {
  return request({
    url:'/api/organization-service/organization/rejected-list',
    method:'post',
    data:data
  })
}

//根据条件查询组织机构列表信息（待审核）

export  function getAuditeList(data) {
  return request({
    url:'/api/organization-service/organization/pending-review-list',
    method:'post',
    data:data
  })
}

//根据条件查询组织机构列表信息（禁用）

export  function getForbiddenList(data) {
  return request({
    url:'/api/organization-service/organization/forbidden-list',
    method:'post',
    data:data
  })
}

//根据条件查询组织机构列表信息（草稿）
export  function getDraftList(data) {
  return request({
    url:'/api/organization-service/organization/draft-list',
    method:'post',
    data:data
  })
}

//根据条件查询组织机构列表信息（启用）

export  function getAvailableList(data) {
  return request({
    url:'/api/organization-service/organization/available-list',
    method:'post',
    data:data
  })
}


//名称重复检查
export  function getRepeatName(data) {
  return request({
    url:'/api/organization-service/organization/name-repeated-check',
    method:'post',
    data:data
  })
}

//根据机构名称进行模糊检索，返回符合条件集合，用于下拉框模糊匹配

export  function fuzzySearch(data) {
  return request({
    url:'/api/organization-service/organization/list/name',
    method:'post',
    data:data
  })
}


//根据组织机构id集合，获取组织机构信息列表（后台服务使用）

export  function findList(data) {
  return request({
    url:'/api/organization-service/organization/list/ids',
    method:'post',
    data:data
  })
}
//添加组织机构至待审核

export  function addOrganizationAuditer(data) {
  return request({
    url:'/api/organization-service/organization/create-submit-review',
    method:'post',
    data:data
  })
}

//根据机构名称进行模糊检索，返回分页信息（项目费率服务使用）

export  function gobackinforation(data) {
  return request({
    url:'/api/organization-service/organization/available-list-organizationtitle',
    method:'post',
    data:data
  })
}

//更新组织机构至待审核


export  function updateOrganizationAuditer(id,data) {
  return request({
    url:`/api/organization-service/organization/${id}/update-submit-review`,
    method:'put',
    data:data
  })
}

//提交审核

export  function gotoAuditer(id,oldId) {
  return request({
    url:`/api/organization-service/organization/${id}/submit-review/${oldId}`,
    method:'put',
  })
}

//审核操作(驳回)

export  function gotoReject(id,data) {
  return request({
    url:`/api/organization-service/organization/${id}/review-reject`,
    method:'put',
    data:data
  })
}

//审核操作(通过)

export  function gotoPass(id) {
  return request({
    url:`/api/organization-service/organization/${id}/review-pass`,
    method:'put',
  })
}

//根据组织机构id，查询组织机构id和名称（后台服务使用）

export  function findIdName(id) {
  return request({
    url:`/api/organization-service/organization/${id}/organizationtitle`,
    method:'get',
  })
}

//组织机构禁用

export  function gotoProhibit(id,oldId) {
  return request({
    url:`/api/organization-service/organization/${id}/forbidden/${oldId}`,
    method:'put',
  })
}

///根据id获取组织机构详细信息（编辑使用）

export  function findDetailInformation(id) {
  return request({
    url:`/api/organization-service/organization/${id}/editing-detail`,
    method:'get',
  })
}

//根据Id获取组织机构详情

export  function findOrganizationDetail(id) {
  return request({
    url:`/api/organization-service/organization/${id}/detail`,
    method:'get',
  })
}

//组织机构启用

export  function organizationToUser(id,oldId) {
  return request({
    url:`/api/organization-service/organization/${id}/available/${oldId}`,
    method:'put',
  })
}

//根据Id删除组织机构

export  function deleteOrganization(id,oldId) {
  return request({
    url:`/api/organization-service/organization/${id}/${oldId}`,
    method:'delete',
  })
}

//更新组织机构至草稿

export  function organizationGotoDraft(id,data) {
  return request({
    url:`/api/organization-service/organization/${id}`,
    method:'put',
    data:data
  })
}

//添加组织机构至草稿

export  function addOrganizationGotoDraft(data) {
  return request({
    url:`/api/organization-service/organization/`,
    method:'post',
    data:data
  })
}
///根据银行及编号信息查询银行列表，用于下拉框模糊匹配
export  function findBankList(data) {
  return request({
    url:`/api/user-service/organization/bank/list`,
    method:'post',
    data:data
  })
}




/*部门管理*/


//添加部门信息
export  function addSectionInfo(data) {
  return request({
    url:`/api/organization-service/organization/department/`,
    method:'post',
    data:data
  })
}

//根据id查询部门信息

export  function searchSectionInfo(id) {
  return request({
    url:`/api/organization-service/organization/department/${id}`,
    method:'get',
  })
}

//修改部门信息

export  function modifySectionInfo(id,data) {
  return request({
    url:`/api/organization-service/organization/department/${id}`,
    method:'put',
    data:data
  })
}

//根据id删除部门信息

export  function deleteSectionInfo(id) {
  return request({
    url:`/api/organization-service/organization/department/${id}`,
    method:'delete',
  })
}

//更新部门信息前根据id查询部门信息

export  function updateSectionInfo(id) {
  return request({
    url:`/api/organization-service/organization/department/${id}/editing-detail`,
    method:'get',
  })
}


//部门信息树结构

export  function getSectionTree(organizationId) {
  return request({
    url:`/api/organization-service/organization/department/department-tree/${organizationId}`,
    method:'get',
  })
}
//部门信息树结构（过滤掉本身的）

export  function getSectionTreeNoAll(data) {
  return request({
    url:`/api/organization-service/organization/department/department-tree`,
    method:'post',
    data:data
  })
}

//查询部门信息列表
export  function getSectionInfoList(data) {
  return request({
    url:`/api/organization-service/organization/department/list`,
    method:'post',
    data:data
  })
}

//获取指定部门id集合的部门信息列表

export  function getIdSectionInfoList(data) {
  return request({
    url:`/api/organization-service/organization/department/list/ids`,
    method:'post',
    data:data
  })
}

//同一组织机构下的部门名称判重

export  function sectionCompare(data) {
  return request({
    url:`/api/organization-service/organization/department/name-repeated-check`,
    method:'post',
    data:data
  })
}

//整体部门预览

export  function previewSectionTree(organizationId) {
  return request({
    url:`/api/organization-service/organization/department/structure-preview/${organizationId}`,
    method:'get',
  })
}


//添加-同一组织机构下的部门名称实时判重

export  function timeCompare(data) {
  return request({
    url:`/api/organization-service/organization/department/name-repeated-checked`,
    method:'post',
    data:data
  })
}

//获取指定机构、部门下的人员信息
export  function getListById(id,ID,userName) {
  return request({
    url:`/api/user-service/user/${id}/${ID}/users`,
    method:'get',
    params:{
      userName:userName
    }
  })
}
///获取机构下各部门的人员信息

export  function getListByOrganizationId(id) {
  return request({
    url:`/api/user-service/user/${id}/users`,
    method:'get',
  })
}


//获取状态 （0：草稿；1：待审核；2：已驳回；）


export  function getStatusCheck(id) {
  return request({
    url:`/api/organization-service/organization/${id}/status`,
    method:'get',
  })
}


//////////////////////////用户

//根据用户名，查询简单用户对象（包括id、userName、realName）

export  function getusername(data) {
  return request({
    url:`/api/user-service/user/simple/list`,
    method:'post',
    data:data
  })  
}

//查询在职用户列表

export  function getUserList(data) {
  return request({
    url:`/api/user-service/user/inplace/list`,
    method:'post',
    data:data
  })
}
//查询在职用户个数

export  function getUserCount() {
  return request({
    url:`/api/user-service/user/inplace/count`,
    method:'get',
  })
}

//禁用

export  function toNoUser(id) {
  return request({
    url:`/api/user-service/user/${id}/forbid`,
    method:'put',
  })
}

//离职

export  function toQuit(id) {
  return request({
    url:`/api/user-service/user/${id}/quit`,
    method:'put',
  })
}

/////////////////////区域

export  function getName(id) {
  return request({
    url:`/api/location-service/region/${id}/name`,
    method:'get',
  })
}

//获取省的集合，以id为标识

export  function getProvince() {
  return request({
    url:`/api/location-service/region/provinces-based-id`,
    method:'get',
  })
}

//获取以省为第一级的3级树结构

export  function getRegion() {
  return request({
    url:`/api/location-service/region/threeleveltree-startwith-province`,
    method:'get',
  })
}




























