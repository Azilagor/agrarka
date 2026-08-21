/*
  window.addEventListener('scroll', function () {
  const header = document.getElementById('header');
  if (window.scrollY > 100) {
                header.classList.add('fixed');
    } else {
                header.classList.remove('fixed');
   }
});
*/		

$(function (){
		
$('.left_block_btn').click(function(e){ 
	
	
	if ($('.left_block_btn').hasClass("disabled")) {
      return false;
    }
	else
	{
	
	e.preventDefault();
	
	$('.left_block_btn').addClass("disabled");
	
	let leftSide = $('.main-menu-block').width();
	
	if(leftSide > 0) { 
	               
				   
				  $(".main-menu-block ul li").css("opacity","0");
	              
				  $("body").css('overflow','auto');
				  $(".overlay").css('display','none'); 
                  $(".hamburger").removeClass('hamburger_close');
				  
				  //$(".main-menu-block").animate({width:'0px'},355 );
				  
				  
				  
				  //$(".main-menu-block").hide(155, function(){  $(".left_block").removeClass("open"); $('.left_block_btn').removeClass("disabled"); } );
				  
				  $(".left_block").removeClass("open");
				  $(".main-menu-block").removeClass("menu-expanded");
				  $('.left_block_btn').removeClass("disabled");
				  
				  
				     
				 } else{ 
				 
				  
				  
				  $(".left_block").addClass("open");
				  
				  $("body").css('overflow','hidden');
				  $(".overlay").css('display','block'); 
				  $(".hamburger").addClass('hamburger_close');
				  
				  $(".main-menu-block ul li").css("opacity","1"); 
				  $(".main-menu-block").addClass("menu-expanded");
				  $('.left_block_btn').removeClass("disabled");
				  
				  //$(".main-menu-block").animate({width:'300px'},355, function(){  $(".main-menu-block ul li").css("opacity","1"); $('.left_block_btn').removeClass("disabled"); } ); 
				  
				  $(".main-menu-block").css('display','block'); 
				  
                  
				 }
				 
				 
				 
    }			 

				 				 
});

});

$(function (){
	
	$(".parent-icon").click(function () {
    
	$(this).toggleClass("parent-icon-down");
	$(this).children('.sub-menu-block').toggle();
	
  });

$('.main-menu6666 > .deeper').click(function () { 
	
        $(this).toggleClass("parent-icon parent-icon-down");
		
		$(this).children('.sub-menu-block').toggle();
});

});


function animateCount(selector, target, steps, duration,textend) {
    let element = document.querySelector(selector);
    if (!element || element.dataset.animated) return;
    element.dataset.animated = "true";

    let count = 0;
    //let steps = 50; 
    let stepSize = Math.ceil(target / steps); 
    let interval = duration / steps; 

    let counter = setInterval(function () {
      count += stepSize;
      if (count >= target) {
        count = target;
        clearInterval(counter);
      }
      element.textContent = count+textend;
    }, interval);
  }
  

  function checkVisibility() {
	  
    let element = document.querySelector(".count");  
    
	if (!element) {  
      window.removeEventListener("scroll", checkVisibility); 
      return;
    }
	
	let rect = element.getBoundingClientRect();
    let windowHeight = window.innerHeight;

    
    if (rect.top + rect.height / 2 < windowHeight / 2 && rect.bottom > 0) {
      
	  animateCount(".count_1", 2001,50,500,'');
	  animateCount(".count_2", 7746,50,500,'');
	  animateCount(".count_3", 98,50, 500,'%');
	  animateCount(".count_4", 10,50, 5000,'');
	  
	  
      window.removeEventListener("scroll", checkVisibility); 
    }
  }
  
  
/*
  
*/

document.addEventListener("DOMContentLoaded", function () {
	
	
	
	
	window.addEventListener("scroll", checkVisibility);
    checkVisibility();
	
	let contentElement = document.querySelector(".site-grid"); 

    if (contentElement) {
        let content = contentElement.innerHTML;

        let matches = [...content.matchAll(/{spoiler=(.*?)\}(.*?)\{\/spoilers\}/gs)];

        if (matches.length > 0) {
            let newContent = content;

            matches.forEach((match, index) => {
                let title = match[1];
                let text = match[2];
                let id = "spoiler-" + index;

                let replacement = `<div class="spoiler_body">
                    <button class="btn btn-spoiler w-100 p-3 d-flex justify-content-between align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#${id}" aria-expanded="false">
                        <span class="text-start">${title}</span>
						<span class="icon"></span>
                    </button>
                    <div class="collapse" id="${id}">
                        <div class="card card-body">
                            ${text}
                        </div>
                    </div>
					</div>
                `;

                newContent = newContent.replace(match[0], replacement);
            });

            contentElement.innerHTML = newContent; 

            
            document.querySelectorAll(".collapse").forEach(function (el) {
                new bootstrap.Collapse(el, { toggle: false });
            });
        }
    }
	
	
	//* -- *//
	
	let blocks = document.querySelectorAll('.blog-item, .item-image img, p:not(.noanimate), img:not(.noanimate)');

    function checkBlocksVisibility() {
        let windowHeight = window.innerHeight;

        blocks.forEach(block => {
            let blockPosition = block.getBoundingClientRect().top;

            if (blockPosition < windowHeight - 30) {
                block.style.opacity = "1";
                block.style.transform = "translateY(0)";
				
				
				
            }
        });
    }

    checkBlocksVisibility(); 
	window.addEventListener('scroll', checkBlocksVisibility); 

    
    document.querySelectorAll('.collapse').forEach(collapse => {
        collapse.addEventListener('shown.bs.collapse', () => {
            setTimeout(checkBlocksVisibility, 50); 
        });
        collapse.addEventListener('hidden.bs.collapse', () => {
            setTimeout(checkBlocksVisibility, 50); 
        });
    });
	
	//* -- *//
	
	
});




