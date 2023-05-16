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
    photo.classList.add('photo')
    photo.setAttribute('src',general_infos.picture)
    doc_plan.side_col.appendChild(photo)
    // -- name
    let name = document.createElement('p')
    t = general_infos.first_name + ' ' + general_infos.last_name
    name.classList.add('name')
    name.innerHTML = t.toUpperCase()
    doc_plan.main_col.appendChild(name)
    
// SECTIONS
    // -- init sections ; add title bars
    doc_plan.section = {}
    for (prop in data) { cr_section(prop, data[prop], doc_plan) }
    // -- intro
    doc_plan.section.introduction.appendChild(cr_block_text(
        data.introduction.content,
        '',
        "intro"
        ))
    doc_plan.section.introduction.appendChild(cr_end_block_div())
    // -- relevant
    for (let job of data.relevant.content) {
        if (!job.secondary) {
            doc_plan.section.relevant.appendChild(cr_job_block(job)) 
        }
    }
    // -- experiences
    for (let job of data.jobs.content) {
        if (!job.secondary) {
            doc_plan.section.jobs.appendChild(cr_job_block(job)) 
        }
    }
    // -- formation
    for (let edu of data.education.content) {
        if (!edu.secondary) {
            doc_plan.section.education.append(cr_edu_block(edu)) 
        }
    }
    // -- coordonnées
    doc_plan.section.contact.appendChild(cr_coord_block(data.contact))
    // -- compétences
    for (let skill of data.skills.content) {
        if (!skill.secondary) {
            doc_plan.section.skills.appendChild(cr_skill_block(skill))
        }
    }
    // -- intérets
    doc_plan.section.interests.appendChild(cr_block_text(data.interests.content, '- '))
    doc_plan.section.interests.appendChild(cr_end_block_div())
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
    el.classList.add(section)
    el.appendChild(cr_section_title(obj.title))
    if (obj.title[0] == 'c')    { plan.side_col.append(el) }
    else                        { plan.main_col.append(el) }
    plan.section[section] = el
}

function cr_job_block(job) {
    // job title and date
    let job_block = document.createElement('div')
    let block_head_1 = document.createElement('div')
    block_head_1.append(
        cr_block_title(job.title), 
        cr_separator('·'), 
        cr_block_date(job.date_start, job.date_end)
        )
    job_block.appendChild(block_head_1)
    // job company and city
    let block_head_2 = document.createElement('div')
    block_head_2.classList.add('block_head_2')
    block_head_2.append(
        cr_block_head_item(job.entreprise), 
        cr_separator('·'), 
        cr_block_head_item(job.city),
        cr_separator('·'), 
        cr_block_head_item(job.contract)
        )
    job_block.appendChild(block_head_2)
    // job details
    job_block.appendChild(cr_block_text(job.content, '- '))
    job_block.appendChild(cr_end_block_div())

    return job_block
}

function cr_edu_block(edu) {
    // edu title and date
    let edu_block = document.createElement('div')
    let block_head_1 = document.createElement('div')
    block_head_1.append(
        cr_block_title(edu.title), 
        cr_separator('·'), 
        cr_block_date(edu.date_start, edu.date_end)
        )
    edu_block.appendChild(block_head_1)
    // edu company and city
    let block_head_2 = document.createElement('div')
    block_head_2.classList.add('block_head_2')
    block_head_2.append(
        cr_block_head_item(edu.school), 
        cr_separator('·'), 
        cr_block_head_item(edu.city)
        )
    edu_block.appendChild(block_head_2)
    edu_block.appendChild(cr_end_block_div())

    return edu_block
}

function cr_skill_block(skill) {
    let skill_block = document.createElement('div')
    let block_head = document.createElement('div')
    block_head.classList.add('block_head_2')
    block_head.append(cr_block_head_item(skill.title))
    skill_block.appendChild(block_head)
    skill_block.appendChild(cr_block_text(skill.content))
    skill_block.appendChild(cr_end_block_div())

    return skill_block
}

function cr_coord_block(coord) {
    let coord_block = document.createElement('div')
    for (item in coord) {
        if (item == 'title') {continue}
        let coord_item = document.createElement('div')
        coord_item.classList.add("item_coord")
        coord_item.innerHTML = cr_icon(item)
        if (coord[item].split(':')[0]=='https') {
            coord_item.append( cr_link(coord[item]) )
        }
        else {
            coord_item.append( cr_block_head_item(coord[item]) )
        }
        coord_block.appendChild(coord_item)
        coord_block.appendChild(cr_end_block_div())

    }

    return coord_block
}

// LINE BUILDERS
function cr_section_title(title) {
    let div = document.createElement("div")
    let el = document.createElement("span")
    let bar = document.createElement("span")
    div.classList.add("section_title")
    bar.classList.add("barre")
    el.innerHTML = title.toUpperCase()
    div.append(el, bar)
    return div
}
function cr_block_text(lines, puce='', textclass=false) {
    let div = document.createElement('div')
    for (let line of lines) {
        let p = document.createElement('p')
        p.innerHTML = puce + line
        if (textclass) {p.classList.add(textclass)}
        div.appendChild(p)
    }
    return div
}
function cr_block_title(source) {
    let span = document.createElement('span')
    span.classList.add("block_title")
    span.innerHTML = source
    return span
}
function cr_block_date(source_start, source_end) {
    let span = document.createElement('span')
    let s_span = document.createElement('span')
    let e_span = document.createElement('span')
    s_span.innerHTML = source_start
    e_span.innerHTML = source_end
    let separator = source_end==''? '':'-'
    span.append(
        s_span, 
        cr_date_separator(separator), 
        e_span
        )
    span.classList.add("block_head_item")
    return span
}
function cr_block_head_item(source) {
    let span = document.createElement('span')
    span.classList.add("block_head_item")
    span.innerHTML = source
    return span
}
function cr_link(source) {
    let link = document.createElement('a')
    link.setAttribute('href', source)
    link.innerHTML = source.split('//')[1]
    return link
}

// SEPARATORS
function cr_separator(separator) {
    let span = document.createElement('span')
    span.classList.add("separator")
    span.innerHTML = separator
    return span
}
function cr_date_separator(separator) {
    let span = document.createElement('span')
    span.classList.add("date_separator")
    span.innerHTML = separator
    return span
}
function cr_end_block_div() {
    let div = document.createElement('div')
    div.classList.add("end_block")
    return div
}

// ICONS
function cr_icon(icon) {
    switch (icon) {
        case 'adresse':
            return '<i class="fa-solid fa-location-dot" style="padding-top:6px"></i>'
        case 'telephone':
            return '<i class="fa-solid fa-phone"></i>'
        case 'mail':
            return '<i class="fa-solid fa-paper-plane"></i>'
        case 'github':
            return '<i class="fa-brands fa-github"></i>'
        case 'itchio':
            return '<i class="fa-solid fa-gamepad"></i>'
        default:
            return '<i></i>'
    }
}