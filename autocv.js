fetch('./content.json')
    .then((r)=> r.json())
    .then((json)=> createCV(json))

///////////////////
// MAIN FUNCTION //
///////////////////

function createCV(data) {
// INITS
    let doc_plan = {}
    let cv_element = document.getElementById('cv')
    let general_infos = data.general
    delete data.general
    
// TITRES, PHOTOS
    cr_basic_grid(cv_element, doc_plan)
    // -- titre cv
    doc_plan.title_bar.innerHTML = general_infos.title.toUpperCase()
    // -- photo
    let photo = document.createElement('img')
    photo.setAttribute('class','photo')
    photo.setAttribute('src',general_infos.picture)
    doc_plan.side_col.appendChild(photo)
    // -- name
    let name = document.createElement('p')
    t = general_infos.first_name + ' ' + general_infos.last_name
    name.setAttribute('class','name')
    name.innerHTML = t.toUpperCase()
    doc_plan.main_col.appendChild(name)
    
// SECTIONS
    // -- init sections 
    doc_plan.section = {}
    for (prop in data) { cr_section(prop, data[prop], doc_plan) }
    // -- intro
    for (line of data.introduction.content) {
        doc_plan.section.introduction.appendChild(cr_text_line(line))
    }
    // -- experiences
    for (job of data.jobs.content) {
        if (!job.secondary) {
            doc_plan.section.jobs.appendChild(cr_job_block(job)) 
        }
        
    }

    // -- compétences
    for (skill of data.skills.content) {
        doc_plan.section.skills.appendChild(cr_text_line(skill.content))
    }
    // -- intérets
    for (int of data.interests.content) {
        doc_plan.section.interests.appendChild(cr_text_line(int))
    }
    console.log(doc_plan)
}

/////////////////////////
// SECONDARY FUNCTIONS //
/////////////////////////

// BLOCK BUILDERS
function cr_basic_grid(el, plan) {
    let title_bar = document.createElement("div")
    let main_cv = document.createElement("div")
    let main_col = document.createElement("div")
    let side_col = document.createElement("div")
    title_bar.setAttribute('id','title_bar')
    main_cv.setAttribute('id','main_cv')
    main_col.setAttribute('id','main_col')
    side_col.setAttribute('id','side_col')
    main_cv.append(main_col, side_col)
    el.append(title_bar, main_cv)
    plan.main_col = main_col
    plan.side_col = side_col
    plan.title_bar = title_bar
}
function cr_section(section, obj, plan) {
    let el = document.createElement("section")
    el.appendChild(cr_section_title(obj.title))
    if (obj.title[0] == 'c')    { plan.side_col.append(el) }
    else                        { plan.main_col.append(el) }
    plan.section[section] = el
}
function cr_job_block(job) {
    // job title and date
    let job_block = document.createElement('div')
    let block_head_1 = document.createElement('div')
    block_head_1.setAttribute('class','block_line')
    block_head_1.append(
        cr_block_title(job.title), 
        cr_separator('|'), 
        cr_block_date(job.date_start, job.date_end)
        )
    job_block.appendChild(block_head_1)
    // job company and city
    // job details
    for (line of job.content) { 
        job_block.appendChild(cr_text_line(line, '- '))
    }

    return job_block
}

// LINE BUILDERS
function cr_section_title(title) {
    let div = document.createElement("div")
    let el = document.createElement("span")
    let bar = document.createElement("span")
    div.setAttribute('class',"section_title")
    bar.setAttribute('class',"barre")
    el.innerHTML = title.toUpperCase()
    div.append(el, bar)

    return div
}
function cr_text_line(source, list='') {
    let p = document.createElement('p')
    p.setAttribute('class',"block_text")
    p.innerHTML = list + source
    return p
}
function cr_block_title(source) {
    let span = document.createElement('span')
    span.setAttribute('class',"block_title")
    span.innerHTML = source
    return span
}
function cr_block_date(source_start, source_end) {
    let span = document.createElement('span')
    let s_span = document.createElement('span')
    let e_span = document.createElement('span')
    s_span.innerHTML = source_start
    e_span.innerHTML = source_end
    span.append(
        s_span, 
        cr_date_separator('-'), 
        e_span
        )
    span.setAttribute('class',"block_date")
    return span
}

// SEPARATORS
function cr_separator(separator) {
    let span = document.createElement('span')
    span.setAttribute('class',"separator")
    span.innerHTML = separator
    return span
}
function cr_date_separator(separator) {
    let span = document.createElement('span')
    span.setAttribute('class',"date_separator")
    span.innerHTML = separator
    return span
}