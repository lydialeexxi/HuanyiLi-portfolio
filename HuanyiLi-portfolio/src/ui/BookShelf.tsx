import { useState, useRef, useEffect, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { WORKS } from '../data/works'
import { getWorkDoc } from '../data/workDocs'
const allBooks=WORKS.en.sections.flatMap(section=>(section.items||[]).map(item=>({...item,category:section.title})))
const order=['last-bloom','heart-hourglass','renewpath','mirage','fading-light','ascending','coral','other','algorithmic-odyssey']
const books=order.map(slug=>allBooks.find(book=>book.slug===slug)!)
const covers:Record<string,string>={renewpath:'/assets/cover-renewpath.jpg',mirage:'/assets/cover-mirage.jpg','fading-light':'/assets/cover-fading.jpg','last-bloom':'/assets/last-bloom-world.png',ascending:'/assets/cover-ascending.jpg',coral:'/assets/cover-coral.jpg','heart-hourglass':'/assets/project.png',other:'/assets/cover-play.jpg','algorithmic-odyssey':'/assets/cover-board.jpg'}
const palettes=['#eecbb0','#3d285a','#b7b5d1','#f16a32','#778367','#e6bf9e','#cfb5e4','#4e3472','#b6bd91']
export default function BookShelf(){
 const [index,setIndex]=useState(0),[opened,setOpened]=useState<number|null>(null)
 const hover=useRef<number|null>(null)
 const drag=useRef({x:0,index:0,moved:false,down:false})
 const select=(n:number)=>setIndex(Math.max(0,Math.min(books.length-1,n)))
 return <section className="books-section" id="work"><div className="section-top"><span>01 / SELECTED WORK</span><span>2023 — 2026</span></div><div className="books-heading"><h2>A few chapters<br/>of <em>my creativity.</em></h2><p>Products, places, and playful possibilities.<br/>Pick a book. There’s a story inside.</p></div>
 <div className="book-arc" aria-label="Project bookshelf" tabIndex={0} aria-describedby="bookshelf-hint"
 onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(index+(e.key==='ArrowRight'?1:-1))}}}
 onPointerEnter={e=>{hover.current=e.clientX}}
 onPointerDown={e=>{drag.current={x:e.clientX,index,moved:false,down:true}}}
 onPointerMove={e=>{if(drag.current.down){const dx=e.clientX-drag.current.x;if(Math.abs(dx)>12){drag.current.moved=true;select(drag.current.index-Math.round(dx/95))}return}if(e.pointerType==='mouse'){if(hover.current===null){hover.current=e.clientX;return}const dx=e.clientX-hover.current;if(Math.abs(dx)>65){select(index+(dx>0?1:-1));hover.current=e.clientX}}}}
 onPointerUp={()=>{drag.current.down=false}}
 onPointerCancel={()=>{drag.current.down=false;hover.current=null}}
 onPointerLeave={()=>{drag.current.down=false;hover.current=null}}>

 {books.map((b,i)=>{const d=i-index,doc=getWorkDoc(b.slug);return <button key={b.slug} className={'book-cover '+(d===0?'is-selected':'')} style={{'--offset':d,'--rise':Math.min(d*d*18,230)+'px','--angle':d*10+'deg','--cover':palettes[i],zIndex:20-Math.abs(d)} as CSSProperties} onClick={()=>{if(drag.current.moved){drag.current.moved=false;return}setIndex(i);setOpened(i)}} aria-label={'Open '+b.name} tabIndex={Math.abs(d)>2?-1:0}><span className="book-spine"/><span className="cover-top">HUANYI LI / SELECTED WORK</span>{(covers[b.slug||'']||doc?.banner)?<img src={covers[b.slug||'']||doc?.banner} alt="" draggable={false}/>:<span className="bloom-symbol" aria-hidden="true">✳</span>}<span className="cover-bottom"><span className="cover-number">{String(i+1).padStart(2,'0')}</span><strong>{b.name}</strong><small>{b.meta}</small></span></button>})}
 </div><div className="book-selection"><div aria-live="polite"><span>{String(index+1).padStart(2,'0')} / {String(books.length).padStart(2,'0')}</span><h3>{books[index].name}</h3><p>{books[index].meta}</p><button className="text-button" onClick={()=>setOpened(index)}>OPEN THE BOOK ↗</button></div></div><p className="drag-hint" id="bookshelf-hint"><span className="mouse-hint">MOVE YOUR MOUSE TO BROWSE</span><span className="touch-hint">SWIPE TO EXPLORE</span> · CLICK TO OPEN <span className="keyboard-hint">· ← → KEYS</span></p>
 {opened!==null&&<BookReader key={opened} book={books[opened]} number={opened+1} close={()=>setOpened(null)}/>}
 </section>
}
function BookReader({book,number,close}:{book:typeof books[number];number:number;close:()=>void}){
 const doc=getWorkDoc(book.slug)!,[page,setPage]=useState(0),[direction,setDirection]=useState(1),dialog=useRef<HTMLDivElement>(null)
 const imageMatches=[...doc.body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)]
 const images=imageMatches.map(m=>({alt:m[1],url:m[2]}))
 const text=doc.body.replace(/!\[[^\]]*\]\([^)]+\)/g,'').trim()
 const chunks=text.split(/(?=^### )/m).filter(Boolean)
 const total=Math.max(chunks.length,images.length,1)
 const turn=(n:number)=>{if(n<0||n>=total)return;setDirection(n>page?1:-1);setPage(n)}
 useEffect(()=>{const prior=document.activeElement as HTMLElement;const prev=document.body.style.overflow;document.body.style.overflow='hidden';dialog.current?.focus();return()=>{document.body.style.overflow=prev;prior?.focus()}},[])
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='Escape')close();if(e.key==='ArrowRight')turn(page+1);if(e.key==='ArrowLeft')turn(page-1);if(e.key==='Tab'){const nodes=dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled),a[href]');if(!nodes?.length)return;const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&(document.activeElement===first||document.activeElement===dialog.current)){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[page])
 return <div className="reader-overlay" onClick={e=>{if(e.target===e.currentTarget)close()}}><div className="reader" role="dialog" aria-modal="true" aria-label={book.name+' project book'} ref={dialog} tabIndex={-1}><header className="reader-header"><span>VOL. {String(number).padStart(2,'0')} / {book.name}</span><button onClick={close} aria-label="Close project book">CLOSE ×</button></header><div className="book-spread"><AnimatePresence mode="wait" initial={false}><motion.div key={page} className="spread-pages" initial={{opacity:0,rotateY:direction*12,x:direction*12}} animate={{opacity:1,rotateY:0,x:0}} exit={{opacity:0,rotateY:direction*-12,x:direction*-12}} transition={{duration:window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:.26}}><article className="paper text-paper"><span className="paper-label">{book.meta}</span><h2>{book.name}</h2><ReactMarkdown components={{a:({children,...props})=><a {...props} target="_blank" rel="noreferrer">{children} ↗</a>}}>{chunks[page]||'### A closer look\n\nExplore the original project pages, from research and early experiments to the final design.'}</ReactMarkdown><span className="paper-folio">HUANYI LI — {String(page*2+1).padStart(2,'0')}</span></article><div className="paper image-paper">{images[page]?<a href={images[page].url} target="_blank" rel="noreferrer" aria-label="Open full-size project page"><img src={images[page].url} alt={images[page].alt}/><span className="zoom-hint">VIEW FULL SIZE ↗</span></a>:<div className="concept-page"><span>✳</span><h3>{book.name}</h3><p>{book.meta}</p><span className="concept-caption">A PROJECT BY HUANYI LI</span></div>}<span className="paper-folio">{String(page*2+2).padStart(2,'0')}</span></div></motion.div></AnimatePresence></div><footer className="reader-controls"><button className="round-button" onClick={()=>turn(page-1)} disabled={page===0} aria-label="Previous pages">←</button><span aria-live="polite">SPREAD {page+1} / {total}<small>Use ← → keys to turn the pages</small></span><button className="round-button" onClick={()=>turn(page+1)} disabled={page===total-1} aria-label="Next pages">→</button></footer></div></div>
}
