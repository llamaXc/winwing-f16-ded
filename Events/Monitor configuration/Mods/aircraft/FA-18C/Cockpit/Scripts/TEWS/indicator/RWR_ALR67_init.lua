dofile(LockOn_Options.common_script_path.."devices_defs.lua")


indicator_type = indicator_types.COMMON

purposes                  = {render_purpose.GENERAL}


shaderLineParamsUpdatable  = true
shaderLineDefaultThickness = 0.1 --0.8 winwing 20200820
shaderLineDefaultFuzziness = 0.1 --0.4 winwing 20200820
shaderLineDrawAsWire 	   = false
shaderLineUseSpecularPass  = true


dofile(LockOn_Options.common_script_path.."ViewportHandling.lua")
try_find_assigned_viewport("F18_RWR")






opacity_sensitive_materials = 
{
	"font_RWR",
	"RWR_STROKE"
}

-------PAGE IDs-------
id_Page =
{
	PAGE_OFF    = 0,
	PAGE_MAIN   = 1,
	PAGE_BIT	= 2
}

id_pagesubset =
{
	COMMON		= 0,
	MAIN		= 1,
	BIT			= 2
}

page_subsets = {}
page_subsets[id_pagesubset.COMMON]	= LockOn_Options.script_path.."TEWS/indicator/RWR_ALR67_COMMON_page.lua"
page_subsets[id_pagesubset.MAIN]	= LockOn_Options.script_path.."TEWS/indicator/RWR_ALR67_MAIN_page.lua"
page_subsets[id_pagesubset.BIT]	    = LockOn_Options.script_path.."TEWS/indicator/RWR_ALR67_BIT_page.lua"
  	
----------------------
pages = {}
pages[id_Page.PAGE_OFF]		= {}
pages[id_Page.PAGE_MAIN]	= {id_pagesubset.COMMON, id_pagesubset.MAIN}
pages[id_Page.PAGE_BIT]		= {id_pagesubset.COMMON, id_pagesubset.BIT}

init_pageID			= id_Page.PAGE_OFF
use_parser			= false

--- master modes
RWR_ALR67_OFF		= 0 
RWR_ALR67_MAIN		= 1 
RWR_ALR67_BIT		= 2

pages_by_mode                 = {}
clear_mode_table(pages_by_mode, 2, 0, 0)

function get_page_by_mode(master,L2,L3,L4)
	return get_page_by_mode_global(pages_by_mode,init_pageID,master,L2,L3,L4)
end

pages_by_mode[RWR_ALR67_OFF][0][0][0]		= id_Page.PAGE_OFF
pages_by_mode[RWR_ALR67_MAIN][0][0][0]		= id_Page.PAGE_MAIN
pages_by_mode[RWR_ALR67_BIT][0][0][0]		= id_Page.PAGE_BIT