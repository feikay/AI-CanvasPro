# Obfuscated File Patches for COOL Integration

This reference contains all obfuscated JavaScript file patches extracted from
`patches/vendor-registry.json`. Apply these in order after running `apply-patches.js`.

---

## 1. src/modules/providers.js

**Purpose**: Add COOL to `PROVIDERS_META` object so the provider selector includes COOL.

| # | Search (locate) | Replacement |
|---|---|---|
| 1 | `,'aicanvas':{'id':'aicanvas','label':` | `,'cool':{'id':'cool','label':'COOL (MJ API)','defaultUrl':'https://api.mjapi.cc.cd','logoPath':null},'aicanvas':{'id':'aicanvas','label':` |

The search string is the last entry in PROVIDERS_META before 'aicanvas'. The replacement adds the COOL entry before it.

---

## 2. api/configApi.js

**Purpose**: Add `'cool'` to `DEFAULT_SECURE_PROVIDER_IDS` array.

| # | Search (locate) | Replacement |
|---|---|---|
| 1 | `'volcengine','aicanvas'` | `'cool','volcengine','aicanvas'` |

---

## 3. api/providerConnectionTestApi.js

**Purpose**: Add COOL provider connection test probe function. Three changes needed.

### Change 1: Add 'cool' to DEFAULT_PROVIDER_TEST_IDS

| Search (locate) | Replacement |
|---|---|
| `a61_0xa60831(0x1a2)]),COM` | `a61_0xa60831(0x1a2),'cool']),COM` |

### Change 2: Insert coolProviderProbe function

Search for: `async function volcengineProviderProbe`

Insert BEFORE this line:

```
async function coolProviderProbe(_0x4a2b3c){const _0x2t=a61_0xa60831,_0x3d=providerConfigWithDefaults('cool',_0x4a2b3c),_0xst=[];if(!_0x3d['apiKey'])return _0xst['push'](makeStep('config',![],'API Key 未填写','',{'category':'missing_key'})),finishProviderResult('cool',_0xst);if(!_0x3d['apiUrl'])return _0xst['push'](makeStep('config',![],'接口地址未配置','',{'category':'missing_url'})),finishProviderResult('cool',_0xst);_0xst['push'](makeStep('config',!![],'接口地址和 API Key 已填写'));
const _0xmu=stripKnownOpenAiTail(_0x3d['apiUrl'])+'/v1/cool/models';if(_0xmu){const _0xpr=await request('/api/v2/proxy/task?apiUrl='+encodeURIComponent(_0xmu),{'method':'GET','headers':{'Authorization':'Bearer '+_0x3d['apiKey']}},TEST_TIMEOUT_MS);if(isSuccessfulProbe(_0xpr))_0xst['push'](makeStep('auth',!![],'API Key 可用，模型列表可访问','cool-models'));else{const _0xcf=classifyProbeFailure(_0xpr);return _0xst['push'](makeStep('auth',![],humanizeCategory(_0xcf,'cool'),summarizeFailure(_0xpr),{'category':_0xcf})),finishProviderResult('cool',_0xst);}}return finishProviderResult('cool',_0xst);}
```

### Change 3: Add cool branch in testProviderConnection

Search for: `if(_0x33d60a===_0x5e02d6(0x24f))return runningHubProviderProbe`

Insert BEFORE this line:

```
if(_0x33d60a==='cool')return coolProviderProbe(_0xd50c56);
```

---

## 4. src/modules/app/appTopbarAndConfig.js

**Purpose**: Add 'cool' to the provider ID array used to collect API keys from input fields.

| Search (locate) | Replacement |
|---|---|
| `_0x43ed5c(0x22d),_0x43ed5c(0x28a),_0x43ed5c(0x26a),_0x43ed5c(0x193),_0x43ed5c(0x1e0),_0x43ed5c(0x264),_0x43ed5c(0x217)]` | `_0x43ed5c(0x22d),_0x43ed5c(0x28a),_0x43ed5c(0x26a),_0x43ed5c(0x193),_0x43ed5c(0x1e0),_0x43ed5c(0x264),_0x43ed5c(0x217),'cool']` |

---

## 5. src/modules/imageFunctionModelMenu.js

**Purpose**: Add COOL to the image function node's provider menu. Two changes needed.

### Change 1: Add COOL to IMAGE_FUNCTION_PROVIDER_META

Search for: `'runninghub':Object[a503_0x5144f4(0x186)]({get 'name'(){const _0x2cc754=a503_0x5144f4;return t(_0x2cc754(0x172));},'icon':'images/RH.png',get 'description'(){const _0x196651=a503_0x5144f4;return t(_0x196651(0x19a));},'modelIconStrategy':a503_0x5144f4(0x191)})})`

Replace with: the same content + `,'cool':Object[a503_0x5144f4(0x186)]({'name':'COOL','icon':'CL','description':'COOL (MJ API) 网关','isTextIcon':!![]})` before the closing `})`

### Change 2: Add COOL to IMAGE_FUNCTION_MENU_PROVIDER_BY_GROUP

Search for: `'runninghubModel':a503_0x5144f4(0x13b)})`

Replace with: `'runninghubModel':a503_0x5144f4(0x13b),'cool':'cool','cool-vip':'cool'})`

---

## 6. src/components/aigenImage/uiModuleModelHelpers.js

**Purpose**: Add COOL image menu group HTML generation. Four changes needed.

### Change 1: Insert buildCoolImageMenuGroupHTML function

Search for: `export function buildRunningHubWorkflowImageMenuGroupHTML(_0x7caa57){`

Insert AFTER this line:

```
export function buildCoolImageMenuGroupHTML(_0x3c0f51){const _0x4e7c8e=a158_0x25655a;const _0x25a6df=getImageModelMenuManifests('cool')['map'](_0x3a5c12=>renderImageManifestMenuItemHTML(_0x3a5c12,_0x3c0f51))['join']('')+getImageModelMenuManifests('cool-vip')['map'](_0x3a5c12=>renderImageManifestMenuItemHTML(_0x3a5c12,_0x3c0f51))['join']('');return renderImageMenuGroupHTML({'headerClass':'cool-group-header','toggleAttr':'data-cool-toggle','submenuClass':'cool-submenu','iconHtml':'<div class="node-menu-icon node-menu-icon-badge">CL</div>','title':'COOL','subtitle':'COOL (MJ API) 图像生成','itemsHtml':_0x25a6df});}
```

### Change 2: Call buildCoolImageMenuGroupHTML in buildImageModelMenuHTML

Search for: `buildRunningHubWorkflowImageMenuGroupHTML(activeModel)+_0x1b1a22(0x292)`

Replace with: `buildRunningHubWorkflowImageMenuGroupHTML(activeModel)+_0x1b1a22(0x261)+buildCoolImageMenuGroupHTML(activeModel)+_0x1b1a22(0x292)`

### Change 3: Add cool branch in setImageModelTriggerIcon

Search for: `if(_0x1b6037===_0x14990f(0x242)){setApimartImageModelTriggerIcon(_0x2206f2,_0x2c9a36);return;}`

Replace with the same line followed by:

```
if(_0x1b6037==='cool'){const _0x4d3c7e=createImageTriggerIcon(_0x2206f2,'div');if(_0x4d3c7e){_0x4d3c7e['className']='image-model-trigger-icon image-model-trigger-badge',_0x4d3c7e['innerText']='CL',replaceImageModelTriggerFirstIcon(_0x2206f2,_0x4d3c7e);}return;}
```

### Change 4: Add cool branch in renderImageModelTriggerIconHTML

Search for: `if(_0x7b72cb===_0x49249c(0x242))return'<div\x20class=\x22image-model-trigger-icon\x20image-model-trigger-badge\x20image-model-trigger-icon-apimart\x22>AM</div>';`

Replace with the same line followed by:

```
if(_0x7b72cb==='cool')return'<div\x20class=\x22image-model-trigger-icon\x20image-model-trigger-badge\x22>CL</div>';
```

---

## 7. src/components/aigenImage/uiModule.impl.js

**Purpose**: Register COOL submenu toggle in AI image node. Insert between Agnes and other bindImageModelMenuSubmenu calls.

Search for: `'agnes',_0x24f1c1)}),bindImageModelMenuSubmenu({'modelMenu':_0x5f2ba4,'modelTrigger':_0x27a3c5,'modelLabel':_0x4a5074,'nodeId':this[_0x1c8e2f(0x10f)],'store':_0x246dc4,'fallbackNodeData':this['_data'],'toggleSelector':`

Replace with: `'agnes',_0x24f1c1)}),bindImageModelMenuSubmenu({'modelMenu':_0x5f2ba4,'modelTrigger':_0x27a3c5,'modelLabel':_0x4a5074,'nodeId':this[_0x1c8e2f(0x10f)],'store':_0x246dc4,'fallbackNodeData':this['_data'],'toggleSelector':'[data-cool-toggle]','submenuSelector':'.img-cool-submenu','defaultProvider':'cool','buildModelPatch':_0x54fc03,'afterSelect':({item:_coolSel})=>setImageModelTriggerIcon(_0x27a3c5,'cool',_coolSel)}),bindImageModelMenuSubmenu({'modelMenu':_0x5f2ba4,'modelTrigger':_0x27a3c5,'modelLabel':_0x4a5074,'nodeId':this[_0x1c8e2f(0x10f)],'store':_0x246dc4,'fallbackNodeData':this['_data'],'toggleSelector':`

---

## 8. src/components/video-node/parameterPanelModelHelpers.js

**Purpose**: Add COOL video menu helper functions. Two changes needed.

### Change 1: Insert buildCoolVideoLogoHTML function BEFORE buildAgnesVideoLogoHTML

Search for: `export function buildAgnesVideoLogoHTML(_0x1f5682=0x14){`

Insert BEFORE this line:

```
export function buildCoolVideoLogoHTML(_0x4ae21a=0x14){const _0x3a6fc3=Number(_0x4ae21a)||0x14,_0x1a9f12=_0x3a6fc3<=0xc?'node-menu-icon-small':'node-menu-icon';return'<div class="'+_0x1a9f12+' node-menu-icon-badge node-menu-icon-badge-dark">CL</div>';}
```

### Change 2: Insert buildCoolVideoMenuItemsHtml function BEFORE buildAgnesVideoMenuItemsHtml

Search for: `export function buildAgnesVideoMenuItemsHtml(_0x189c05){`

Insert BEFORE this line:

```
export function buildCoolVideoMenuItemsHtml(_0x5e8dc1){return getModelsByKind('video')['filter'](_0x2a5b08=>{const _0x25e7e1=_0x2a5b08?.['provider']==='cool'&&_0x2a5b08?.['adapterType']==='modelApi';if(!_0x25e7e1)return![];const _0x4767a4=getManifestVideoMenu(_0x2a5b08);return!!_0x4767a4&&['cool-video','cool-video-vip','cool-video-seedance']['includes'](_0x4767a4['group']||'');})['sort']((_0x49ecaf,_0x2153a2)=>Number(getManifestVideoMenu(_0x49ecaf)?.['order']||0)-Number(getManifestVideoMenu(_0x2153a2)?.['order']||0))['map'](_0x2c5e88=>{const _0x5f4e17=getManifestVideoMenu(_0x2c5e88);return renderNodeMenuItem({'modelId':_0x2c5e88['modelId'],'provider':'cool','label':_0x5f4e17?.['label']||_0x2c5e88['displayName'],'description':_0x5f4e17?.['subtitle']||_0x2c5e88['description']||'','iconHtml':buildCoolVideoLogoHTML(0x14),'vip':_0x2c5e88['vip']===!![]},{'activeModel':_0x5e8dc1});})['join']('');}
```

---

## 9. src/components/video-node/parameterPanelModule.js

**Purpose**: Add COOL to the video node parameter panel. Two changes needed.

### Change 1: Add COOL imports

Search for: `HTML,buildAgnesVideoMenuItemsHtml,buildApimartVideoMenuItemsHtml,buildApimartVideoLogoHTML,buildDreaminaVideoLogoHTML`

Replace with: `HTML,buildAgnesVideoMenuItemsHtml,buildApimartVideoMenuItemsHtml,buildApimartVideoLogoHTML,buildCoolVideoMenuItemsHtml,buildCoolVideoLogoHTML,buildDreaminaVideoLogoHTML`

### Change 2: Add COOL video menu entry

Search for: `'iconHtml':buildAgnesVideoLogoHTML(0x14),'itemsHtml':buildAgnesVideoMenuItemsHtml(_0x390e8a)},{'id':_0xc9fc70(0x255)`

Replace with: `'iconHtml':buildAgnesVideoLogoHTML(0x14),'itemsHtml':buildAgnesVideoMenuItemsHtml(_0x390e8a)},{'id':'cool','label':'COOL','subtitle':'COOL (MJ API) 视频','iconHtml':buildCoolVideoLogoHTML(0x14),'itemsHtml':buildCoolVideoMenuItemsHtml(_0x390e8a)},{'id':_0xc9fc70(0x255)`

---

## 10. src/manifests/modelRegistry.js

**Purpose**: Import and register COOL model manifests. Three changes needed.

### Change 1: Add import statements (BEFORE animeRealExecutionManifest import)

Search for: `import{animeRealExecutionManifest`

Insert BEFORE this line:

```
import{coolImageModelApiExecutionManifests,coolImageModelApiModelManifests}from'./image/modelApi/coolImageManifests.js';import{coolVideoModelApiExecutionManifests,coolVideoModelApiModelManifests}from'./video/modelApi/coolVideoManifests.js';
```

### Change 2: Add COOL to PROVIDER_PREFIXES

Search for: `'volcengine':'volcengine'`

Replace with: `'cool':'cool','volcengine':'volcengine'`

### Change 3: Register COOL manifests (AFTER vendorTextModelApiModelManifests registration)

Search for: `vendorTextModelApiModelManifests[a412_0x4525a6(0x27e)](registerModelManifest);`

Replace with: `vendorTextModelApiModelManifests[a412_0x4525a6(0x27e)](registerModelManifest);coolImageModelApiExecutionManifests[a412_0x4525a6(0x27e)](registerExecutionManifest);coolImageModelApiModelManifests[a412_0x4525a6(0x27e)](registerModelManifest);coolVideoModelApiExecutionManifests[a412_0x4525a6(0x27e)](registerExecutionManifest);coolVideoModelApiModelManifests[a412_0x4525a6(0x27e)](registerModelManifest);`

---

## 11. src/manifests/image/modelApi/index.js

**Purpose**: Add COOL image manifests to aggregation. Three changes needed.

### Change 1: Change re-export to import+export for COOL

Search for: `export{coolImageModelApiModelManifests,coolImageModelApiExecutionManifests}from'./coolImageManifests.js';`

Replace with: `import{coolImageModelApiModelManifests,coolImageModelApiExecutionManifests}from'./coolImageManifests.js';export{coolImageModelApiModelManifests,coolImageModelApiExecutionManifests};`

### Change 2: Add COOL model manifests to vendorImageModelApiModelManifests

Search for: `...volcengineImageModelApiModelManifests]);export const vendorImageModelApiExecutionManifests`

Replace with: `...volcengineImageModelApiModelManifests,...coolImageModelApiModelManifests]);export const vendorImageModelApiExecutionManifests`

### Change 3: Add COOL execution manifests to vendorImageModelApiExecutionManifests

Search for: `...volcengineImageModelApiExecutionManifests]);`

Replace with: `...volcengineImageModelApiExecutionManifests,...coolImageModelApiExecutionManifests]);`

---

## 12. src/manifests/video/modelApi/vendorVideoModelApiManifests.js

**Purpose**: Add COOL video manifests to video aggregation. Six changes needed (targeting obfuscated file).

### Change 1: Add import (BEFORE `const a419_0xa7ef95=a419_0x57e6;`)

Search for: `const a419_0xa7ef95=a419_0x57e6;`

Insert BEFORE: `import{coolVideoModelApiModelManifests,coolVideoModelApiExecutionManifests}from'./coolVideoManifests.js';`

### Change 2: Wrap VENDOR_VIDEO_MODELS.map() in array spread

Search for: `Object[a419_0xa7ef95(0x461)](VENDOR_VIDEO_MODELS[a419_0xa7ef95(0x481)](_0x442899=>createVideoModelApiManifest(`

Replace with: `Object[a419_0xa7ef95(0x461)]([...VENDOR_VIDEO_MODELS[a419_0xa7ef95(0x481)](_0x442899=>createVideoModelApiManifest(`

### Change 3: Add COOL model manifests at array end (vendorVideoModelApiModelManifests)

Search for: `'ratioPolicy':getVideoManifestRatioPolicy(_0x442899)})));export const vendorVideoModelApiExecutionManifests`

Replace with: `'ratioPolicy':getVideoManifestRatioPolicy(_0x442899)})),...coolVideoModelApiModelManifests]);export const vendorVideoModelApiExecutionManifests`

### Change 4: Wrap VENDOR_VIDEO_MODELS.map() in array spread (execution)

Search for: `Object[a419_0xa7ef95(0x461)](VENDOR_VIDEO_MODELS[a419_0xa7ef95(0x481)](_0x412843=>createVideoExecutionManifest(`

Replace with: `Object[a419_0xa7ef95(0x461)]([...VENDOR_VIDEO_MODELS[a419_0xa7ef95(0x481)](_0x412843=>createVideoExecutionManifest(`

### Change 5: Add COOL execution manifests at array end (vendorVideoModelApiExecutionManifests)

Search for: `'resultTaskIdPath':_0x412843[a419_0xa7ef95(0x412)]||'task_id'})));`

Replace with: `'resultTaskIdPath':_0x412843[a419_0xa7ef95(0x412)]||'task_id'})),...coolVideoModelApiExecutionManifests]);`

---

## Notes

- All these files are **obfuscated JavaScript** — variable names and structure may vary
  slightly between versions. If a search string doesn't match exactly, read the file
  and locate the corresponding pattern manually.
- Some patches have multiple changes within the same file. Apply all changes to each
  file before moving to the next.
- After applying all patches, the `apply-patches.js` auto-script should report
  `2/2 成功` with all entries showing "已存在，跳过".
