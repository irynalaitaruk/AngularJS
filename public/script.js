//preloader  
$(window).on('load', function () {
    $preloader = $('.loaderArea'),
    $preloader.delay(350).fadeOut('slow');
  });
//
var app = angular.module("app",["ngRoute","ngDialog"]);

app.controller("myCtrl",function($scope){ });
                        
//directive of login
app.directive('loginBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/login.html',
        controller: function($scope,$http,ngDialog){ 
            $scope.changePasswordStatus = false;
//Logout
            $scope.logOut = function () {
                $scope.newUser = true;
                $scope.enterLogin = false;
                localStorage.userName = "default";
                $scope.profileStatus = false;
            };
//Loading avtoriz user
            if (localStorage.userName == undefined) {
                localStorage.userName = "default";
            } else {
                if (localStorage.userName != "default") {
                    $scope.userIn = "Wellcome " + localStorage.userName + "!!!";
                    $scope.newUser = false;
                   
                    $scope.enterLogin = true;
                    $scope.user = "";
                    let loginObj = {
                        login: localStorage.userName
                    };
                    $http.post('http://localhost:8000/user-prof', loginObj)
                        .then(function successCallback(response) {
                    
                           if(response.data != "User profile is undefined"){
                                    $scope.userProfile = response.data;
                                    $scope.nameUserProfile = $scope.userProfile[0].name;
                                    $scope.snameUserProfile = $scope.userProfile[0].sname;
                                    $scope.dateUserProfile = $scope.userProfile[0].date;
                                    $scope.aboutUserProfile = $scope.userProfile[0].about;
                                    $scope.profileStatus = true;
                                }
                                else{
                                    console.log(response.data)
                                }

                        }, function errorCallback(response) {
                            console.log("Error!!!" + response.err);
                        });


                } else {
                    $scope.newUser = true;
                    $scope.enterLogin = false;
                }
            };
//Avtorization
            $scope.check = function () {
                let loginObj = {
                    login: $scope.login,
                    password: $scope.password
                };
                $http.post('http://localhost:8000/login-auth', loginObj)
                    .then(function successCallback(response) {
                        if (response.data == "welcome") {
                            $scope.userIn = "Wellcome " + $scope.login + "!!!";
                            $scope.newUser = false;
                            $scope.enterLogin = true;
                            $scope.user = "";
                            localStorage.userName = $scope.login;

                            let loginObj = {
                                login: localStorage.userName
                            };
                            $http.post('http://localhost:8000/user-prof', loginObj)
                                .then(function successCallback(response) {
                                
                                if(response.data != "User profile is undefined"){
                                    $scope.userProfile = response.data;
                                    $scope.nameUserProfile = $scope.userProfile[0].name;
                                    $scope.snameUserProfile = $scope.userProfile[0].sname;
                                    $scope.dateUserProfile = $scope.userProfile[0].date;
                                    $scope.aboutUserProfile = $scope.userProfile[0].about;
                                    $scope.profileStatus = true;
                                }
                                else{
                                    console.log(response.data)
                                }

                                }, function errorCallback(response) {
                                    console.log("Error!!!" + response.err);
                                });
                        } else {
                            $scope.user = response.data;
                        };
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
            };
//Registration
            $scope.registr = function () {
                let loginObj = {
                    login: $scope.login,
                    password: $scope.password
                };
                $http.post('http://localhost:8000/login-reg', loginObj)
                    .then(function successCallback(response) {
                        $scope.user = response.data;
                        $http.get('http://localhost:8000/users')
                            .then(function successCallback(response) {
                                $scope.arrUsers = response.data;
                            }, function errorCallback(response) {
                                console.log("Error!!!" + response.err);
                            });
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
            };
            
//Change password
    $scope.changePassword = function (index,login,password) {
        ngDialog.open({
            template: '/template/changePass.html',
            scope: $scope,
            controller: function($scope){
                     $scope.indexChangeItem = index;
                      $scope.editLog = login; 
                      $scope.editPass = password 
                
                
     $scope.editpass = function () {
        let itemObj = {
            login: $scope.editLog,
            password: $scope.editPass,
            id: $scope.indexChangeItem
        };
        $http.post('http://localhost:8000/pass-change', itemObj)
            .then(function successCallback(response) {
            ngDialog.closeAll();
            }, function errorCallback(response) {
                console.log("Error!!!" + response.err);
            });
         };
      }
  })
        .closePromise.then(function(res){
            $http.get('http://localhost:8000/users')
            .then(function successCallback(response) {
                $scope.users = response.data;
           }, function errorCallback(response) {
             console.log("Error!!!" + response.err);
            }); 
        });

    }
            
                        
//                
        }   
    }
});


//directive of profile
app.directive('profileBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/profile.html',
        controller: function ($scope) {}
    }
});
    
//directive of slider
app.directive("slideBlock",function(){
	return{
		replace: true,
		templateUrl:"template/slider.html",
		controller: function($scope){
        $(document).ready(function () {
  
	var imgCount = $('.imgs').length;
	var imgWidth = $('.imgs').width();
	var imgHeight = $('.imgs').height();
	var sliderWidth = imgCount * imgWidth;
    var btnId = 0;
    var slideNow = 1;
    var translateWidth = 0;
	
	$('#box').css({ width: imgWidth, height: imgHeight });
	
	$('#slider').css({ width: sliderWidth, marginLeft: -imgWidth });
	
    $('.imgs:last-child').prependTo('#slider');

    function moveRight() {
        $('#slider').animate({
            left: + imgWidth
        }, 1000, function () {
            $('.imgs:last-child').prependTo('#slider');
            $('#slider').css('left', '');
        });
    };

    function moveLeft() {
        $('#slider').animate({
            left: - imgWidth
        }, 1000, function () {
            $('.imgs:first-child').appendTo('#slider');
            $('#slider').css('left', '');
        });
    };

    
     var x = setInterval(function () {
        moveLeft();
    }, 3000);
    
    $('#box').hover(function(){
        clearInterval(x);
    },function(){
        x = setInterval(function(){
            moveLeft();
        },3000);
    }) 
    
    
    $('a.previous').click(function () {
        moveLeft();
    });

    $('a.next').click(function () {
        moveRight();
    });
    
    //buttons
      $('.btn').click(function () {
        btnId = $(this).index();

        if (btnId + 1 != slideNow) {
            translateWidth = -$('#box').width() * (btnId);
            $('#slider').css({
                'transform': 'translate(' + translateWidth + 'px, 0)'
            });
            slideNow = btnId + 1;
        }
        
    });
//text
 $('.img1').mouseover(function(){
     $('#txt1').css({display:'block',transform:'rotate(-15deg)'}).animate({fontSize: '54px'});
 });
     $('.img1').mouseout(function(){
     $('#txt1').css('display','none')
 });
    
 $('.img2').mouseover(function(){
     $('#txt2').css({display:'block',transform:'rotate(-15deg)'}).animate({fontSize: '54px'});
 });
     $('.img2').mouseout(function(){
     $('#txt2').css('display','none')
 });
    
     $('.img3').mouseover(function(){
     $('#txt3').css({display:'block',transform:'rotate(-15deg)'}).animate({fontSize: '54px'});
 });
     $('.img3').mouseout(function(){
     $('#txt3').css('display','none')
 });
    
     $('.img4').mouseover(function(){
     $('#txt4').css({display:'block',transform:'rotate(-15deg)'}).animate({fontSize: '54px'});
 });
     $('.img4').mouseout(function(){
     $('#txt4').css('display','none')
 });
    
     $('.img5').mouseover(function(){
     $('#txt5').css({display:'block',transform:'rotate(-15deg)'}).animate({fontSize: '54px'});
 });
     $('.img5').mouseout(function(){
     $('#txt5').css('display','none')
 });
    
     $('.img6').mouseover(function(){
     $('#txt6').css({display:'block',transform:'rotate(-15deg)'}).animate({fontSize: '54px'});
 });
     $('.img6').mouseout(function(){
     $('#txt6').css('display','none')
 });
    
     $('.img7').mouseover(function(){
     $('#txt7').css({display:'block',transform:'rotate(-15deg)'}).animate({fontSize: '54px'});
 });
     $('.img7').mouseout(function(){
     $('#txt7').css('display','none')
 });
   
});               
        
     }
	}
})

//directive of menu
app.directive("menuBlock",function(){
    return{
        replace: true,
        templateUrl: "template/menu.html",
        controller: function($scope){
            $scope.arr = [{
    title: "«Київський торт» – смачна помилка кухаря!",
    text:"Київський торт – смачна помилка кухаря, неофіційний символ Києва. Щодня тисячі туристів і гостей столиці, від’їжджаючи з Києва, беруть із собою частинку української культури – «Київський торт». Цей витвір мистецтва люблять, як дорослі, так і діти. Але майже ніхто не знає історію виникнення цього шедевру, символу нашої столиці.Існує декілька цікавих історій створення «смачного дива». Одна цікава легенда говорить про те, що торт нібито з’явився на фабриці ім. Карла Маркса (сьогодні – Київська кондитерська фабрика Roshen) в 1956 році від помилки кондитерів. Готуючи масу з яєчного білка для бісквіту кондитери забули покласти суміш у холодильну камеру. Таким чином, наступного дня начальник бісквітного цеху Костянтин Петренко за допомогою 17-річної помічниці кондитера Надії Чорногор, щоб приховати помилку колег, на свій страх і ризик переклав застиглі білкові коржі масляним кремом, посипав ванільною пудрою та прикрасив поверхню квітковим орнаментом. Так і з’явився улюблений киянами торт, що став візитною карткою Києва.Хоча, насправді, це просто красива легенда. Кондитери цілеспрямовано працювали над винаходом незвичайного рецепта. А винайти його вдалося в 1956 р. Запатентували винахід лише у 1973 році.Цікаво зазначити, що «Київський торт» був одним з подарунків від Української РСР Леоніду Брежнєву на 70-річчя. Це був справжній шедевр, що складався з трьох ярусів і 70 коржів, а важив він понад п’ять кілограмів. Генсекові подарунок припав до душі, і він неодноразово просив своїх кухарів повторити цю «смакоту».Зазначимо, що докладний оригінальний рецепт на Київській фабриці і досі тримають у таємниці.Протягом тривалого часу рецептура торта змінювалась. Так, у перші торти входили справжні горіхи кеш’ю. Адже, в середині 50-х років між СРСР та Індією були досить міцні дружні відносини, і ці горіхи закуповувалися для нашої країни у великих кількостях. З часом пільгові індійські поставки припинилися, і кеш’ю став занадто дорогим інгредієнтом. Ось тоді-то їх і замінили в «Київському торті» на фундук. Але і він, у свою чергу, теж виявився не по кишені для хлібобулочного комбінату, і вони стали використовувати більш дешевий – арахіс.Зміни торкнулися і дизайну упаковки. Замість знакової для старшого покоління емблеми міста – пішохідного мосту, що веде з Подолу на Труханів острів – з’явилися листя каштанів.Сьогодні під брендом «Київський торт» працює безліч хлібокомбінатів столиці України і купити його можна практично в кожному супермаркеті."
},{
    title: "Історичний чизкейк",
    text:"Сьогодні замість стандартної начинки «бісквіт-крем-фрукти» часто замовляють щось більш цікаве. Наприклад, чизкейки. А чи знаєте ви, звідки родом цей чудовий десерт?Виявляється, чизкейк набагато старший, ніж може здатися. Його придумали ще в Стародавній Греції. Ним пригощали олімпійських атлетів і гостей на весіллях. З Греції чизкейк перебрався в Древній Рим і полюбився Юлію Цезарю. Це зробило його приготування обов’язковим у будинках знаті. З Риму пристрасть до чизкейк поширилася в європейські колонії — насамперед, до Англії. А звідти, разом з переселенцями, в Америку.Американці, у свою чергу, придумали всілякі варіації на тему («Нью -Йорк», шоколадні, фруктові чизкейки тощо) і дали десерту назву. Саме тому багато хто думає, що чизкейк — страва американської кухні. Як бачите, це не зовсім так."
             },{ 
    title: "Цікаві факти про весільні фігурки на торт",
    text:"Торт на весілля повинен бути не тільки смачним, але і красивим. Адже, саме йому приділяється багато уваги. На деяких банкетах навіть готуються цілі окремі номери для подачі цього кулінарного шедевра. Тому прикраси торта потрібно приділити максимум уваги. Це стосується і фігурок на весілля — одного з найпопулярніших весільних аксесуарів.Традиція ставити фігурки на весільний торт з’явилася досить давно, причому ніхто досі не знає, звідки вона пішла. Її історія оповита таємницею. Залишаючись на пам’ять, вони, немов, охороняють сім’ю і слугують нагадуванням про солодощі того дня, коли наречений з нареченою стали єдиним цілим.Одна з версій появи фігурок на весільний торт пов’язують з дочкою якогось пекаря, яка жила більше ста років тому. Готуючись до весільного торжества, вона попросила батька спекти торт, прикрасивши його символом вічного кохання, який могли б зрозуміти і побачити всі присутні. Її батько, після досить тривалих роздумів вирішив спробувати спекти торт з двома фігурками на вершині — нареченого і нареченої. Саме вони як не можна краще зможуть показати єдність і торжество любові.Всім гостям настільки припала до душі ця ідея, що слух про неї швидко поширився. З тієї пори практично кожен весільний торт прикрашають фігурки, будь-то нареченого і нареченої, або двох голубів.Можливо, ця історія і фантазія, але вона як не можна краще пояснює, чому такі фігурки вважаються такими важливими для кожної пари молодят.Фігурки на торт, точно також як і оригінальні запрошення на весілля не просто елементи декору. Це в першу чергу згадку, сувенір, який буде постійно нагадувати про той день, коли ви поєднали свої долі воєдино. Також ви можете використовувати фігурки на кожну з ваших річниць, потім — передати дітям, тим самим створивши свою сімейну традицію.Вибираючи фігурки на весільний торт, не варто орієнтуватися винятково на свій смак. Це досить відповідальна справа. Адже, в першу чергу, фігурка повинна відповідати самому торту.Розмір торта. Погодьтеся, досить безглуздо виглядає велика фігурка на маленькому торті, точно також як і маленька — на великому.Декор торта. До неабияк пишно оздобленому торту краще підбирати скромні фігурки і навпаки. Варто звернути увагу на колірне рішення.Їстівні або неїстівні фігурки. Вирішувати тільки вам. До того ж не всі готові оцінити, коли нареченому чи нареченій хтось із гостей голову відкусить."
             },{
    title: "Весільні торти",
    text:"Весільний хліб в тому чи іншому вигляді існував у всіх культурах світу.Наприклад, у Китаї сім'я нареченого посилала нареченій чотири хлібних пирога, їх треба було підкинути вгору і зловити у простирадло, яке тримали над головою. При підкиданні кожного з пирогів наречена цитувала вірші про заміжжя, відзначаючи, таким чином, свій відхід з батьківського дому до чоловіка.У слов'янських національних весільних урочистостей неймовірно багаті і складні традиції, пов'язані з випічкою. У найдавніші язичницькі часи священним хлібом у слов'ян вважався коровай, без нього не обходилося жодне весілля. Він готувався на Русі з дотриманням багатьох обрядових правил.Так, виготовлення тіста доручали тільки заміжній жінці, випічку - чоловікові, нарізку - дитині, а роздачу шматочків короваю запрошеним - свату. При цьому весь цей процес супроводжувався співом особливих «каравайних» пісень.До початку освячення шлюбу молоді повинні були першими торкнутися короваю обличчями і поплакати. Весільні короваї прикрашали складними візерунками з тіста і гілочками калини, якій з язичницьких часів приписують містичні властивості.В Англії весільний торт до 17-го століття залишався досить скромним, у вигляді бісквіта з цукатами і горіхами. І тільки в 19-му столітті на весіллях європейської аристократії стали популярними багатоярусні торти.Вважається, що багатоповерховий весільний торт створив у 18-му столітті один лондонський бакалейщик, йому дуже хотілося створити будь-що незвичайне. Придумати він нічого не міг, поки не звернув увагу на купол Сент-Брайдської церкви на Фліт-стріт.В Європі 19 століття на весіллях були потрібні вже два торти - один для нареченої, інший для нареченого. Головною відмінною рисою торта нареченої було те, що в нього запекалось скляна каблучка, вважалося, що дівчина, яка знайде в своєму шматочку каблучку, незабаром вийде заміж.Торт нареченого прикрашався скромніше, його заздалегідь поділяли на шматочки, укладали в білі коробочки, обв'язували їх білою або срібною стрічкою або просто писали ініціали молодят і складали поряд з виходом. Гості, йдучи додому, могли захопити із собою такі коробочки, щоб передати тим, хто не зміг бути присутнім на урочистостях, або з'їсти самим наступного ранку.На початку 20-го століття торти вже височіли ярусами. Триярусні круглі торти символізували 3 кільця - заручини, весільне і кільце вічності.Традиція спільного розрізання торта нареченим і нареченою виникла в 1930 роках, коли весільні торти покривали «королівською глазур'ю», яка представляла з себе досить жорсткий панцир.Бісквіт - традиційний корж при випіканні тортів, спочатку називався «морськими сухарями». Перші згадки про нього були знайдені в бортових журналах англійських моряків. Свою популярність бісквіт завоював завдяки великому терміну зберігання - він не псувався і не покривався цвіллю, навіть не дивлячись на вологість під час морських подорожей.Цукрова мастика - універсальний матеріал для прикраси сучасних тортів на замовлення знайшов свою популярність ще в 50-х роках. Але її рецепт був відомий ще з 16-го століття. Тоді з мастики робили цукерки і помадки, а покривати нею торт навчилися набагато пізніше. Можливо, це було пов'язано з високими цінами на цукор."  
    },{
    title: "Торт 'Наполеон'",
    text:"У нас він відомий як 'Наполеон', у Франції та Італії його знають як 'Millefeuille' (1000 шарів), у Великобританії - 'Vanilla Slice', 'Tompoes' у Бельгії та Нідерландах і 'Királyi francia krémes' (у перекладі - Французький королівський Кремеш) в Угорщині.Він надзвичайно популярний і вшанований в усьому світі, так як встояти перед цими ласощами, які представляють собою найтонші шари листового тіста просочені найніжнішим вершковим кремом, не можуть не тільки діти, а й дорослі.Згідно з опитуваннями, проведеними Міжнародною Асоціацією кухарів, торт 'Наполеон' займає перше місце серед найбажаніших і улюблених тортів.Кожна сучасна господиня має свій власний секретний рецепт приготування цієї десерту, проте мало хто знає, що насправді істинний рецепт й історія винаходу цього смаколику невідома, в той час як існує кілька більш-менш достовірних версій.В Україні як і в країнах колишнього Радянського Союзу історію створення торта «Наполеон» прийнято пов'язувати з особистістю і слідом в історії французького імператора Наполеона Бонапарта.За однією з найпоширеніших версій перший рецепт цього приголомшливого торту з'явився в 1912 році - напередодні 100-річного ювілею звільнення Москви від французів. Цей ювілей відзначався з особливим розмахом - шилися відповідні костюми, оформлялися вітрини в магазинах, писалися вірші на патріотичну тему - все було просякнуте духом величної перемоги.Не обійшла стороною дана тема й кулінарії - з'явилося нова страва, складена з численної кількості тоненьких шарів змазаних солодким кремом. Форма страви являла собою квадрат, який розрізався по діагоналі. Ці листкові трикутники користувалися незвичайним успіхом, а так як всім відомий Бонапарт у свідомості нашої людини завжди асоціювався з треуголкою (трикутним капелюхом), тому що так виглядав не тільки на картинах, але і в літературних творах, то і за тістечком швидко закріпилася ця назва, яка збереглася до наших днів.За іншою версією, рецепт торту придумав сам Наполеон Бонапарт, коли Жозефіна несподівано застала велелюбного чоловіка за фліртом з однією зі своїх фрейлін. Імператор грайливо шепотів той щось на вушко.Ревнива Жозефіна зажадала негайної відповіді від чоловіка про те, що відбувається. Геніальний імператор зовсім не розгубився і відразу придумав відповідь, що лише ділився рецептом придуманого ним торта з надійною людиною. Моментально вигадавши цікавий склад і спосіб виготовлення кондитерського виробу, Наполеон переконав дружину в своїй безгрішності.Зовсім випадково, свідком цієї розмови став один з маршалів Франції, який в той же вечір розповів про дивний рецепт всьому Версалю, а придворний кухар приготував цей шедевр до столу вже наступного дня - і успіх цього торта був приголомшуючий.Чимало інших цікавих фактів пов'язано із тортами. Деякі з них навіть були зафіксовані і внесені до книги Рекордів Гіннеса."
    },{
    title: "Найбільший торт",
    text:"Найбільшим тортом на сьогоднішній день вважається 59 тонний гігант, зроблений на честь святкування 100-річчя Лас-Вегаса. Торт готували 600 кухарів. Розміри солодкого шедевра склали 31 м завдовжки, 15 м шириною і 50 см заввишки. Друге місце в цій же номінації отримав торт, виготовлений дещо раніше в місті Фот Пейн на честь дня народження штату Алабами, і зроблений у формі його офіційних кордонів. Вага торта перевищує 58 тонн.Найбільшим тортом-морозивом став пекінський торт, розмірами 4,8 м в довжину, 3 метри шириною, 1 м заввишки, і вагою близько 8 тонн із зображенням сімейства ведмедів. Торт замислювався як реклама дитячої вистави «Гора морозива», і був нарізаний на 32000 шматків.Найбільший у світі полуничний торт виготовили пекарі міста Ла-Тринідад. Вони використовували три тонни ягід, тисячі яєць. Торт важив 11 тонн 146 кілограмів і в основі він був п'ять на сім метрів. Торт спробували 50 тисяч філіппінців."
    },{
    title: "Найстаріший торт",
    text:"'Фруктовий торт', спечений більше 100 років тому, виявив на горищі свого будинку південноафриканський фермер. Знахідку навіть планують занесли до 'Книги рекордів Гіннеса' як найстаріший торт у світі. За цей час торт абсолютно скам'янів і припав пилом, але при цьому повністю зберіг форму. Фахівці встановили, що гарне збереження виробу з тіста забезпечив підвищений вміст коньяку. Як з'ясувалося, кондитерський виріб було приготовлено до золотого весілля, на торті добре зберігся напис '6 квітня, 1852-1902'. У той же час навряд чи вдасться з'ясувати, чому про тортик забули і залишили його на горищі."
    }];
                
                $scope.home = true;
                $scope.blog = true;
                $scope.contact = true;
                $scope.slider = true;
                $scope.inputFilter = false;
                $scope.adres = true;
                $scope.loginRow = false;
                $scope.loginRow = false;
                $scope.shopblock = false;
                $scope.main = true;
                $scope.foot = true;
            
        $scope.blogStatus = function(){
            $scope.blog = false;
            $scope.slider = false;
            $scope.inputFilter = true;
            $scope.adres = true;
            $scope.loginRow = false;
            $scope.shopblock = false;
            $scope.main = false;
            $scope.foot = false;
           }
        
         $scope.homeStatus = function(){
            $scope.blog = true;
            $scope.slider = true; 
            $scope.contact = true;
            $scope.inputFilter = false;
            $scope.adres = true;
            $scope.loginRow = false;
            $scope.shopblock = false;
            $scope.main = true;
            $scope.foot = true;
           }
          $scope.contactStatus = function(){
            $scope.blog = true;
            $scope.slider = false; 
            $scope.contact = true;
            $scope.inputFilter = false;
            $scope.adres = false;
            $scope.loginRow = false;
            $scope.shopblock = false;
            $scope.main = false;
            $scope.foot = false;
           }
          $scope.loginStatus = function(){
            $scope.loginRow = true;
            $scope.blog = true;
            $scope.slider = false; 
            $scope.contact = true;
            $scope.inputFilter = false;
            $scope.adres = true;
            $scope.shopblock = false;
          }
          $scope.shopStatus = function(){
                $scope.shopblock = true;
                $scope.blog = true;
                $scope.contact = true;
                $scope.slider = false;
                $scope.inputFilter = false;
                $scope.adres = true;
                $scope.loginRow = false;
                $scope.loginRow = false;
                $scope.main = false;
                $scope.foot = false;
          }
        
        }
    }
})
//main directive
//directive of profile
app.directive('mainBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/main.html',
        controller: function ($scope) {}
    }
});
//directive of contacts
app.directive("contactBlock",function(){
    return{
    replace: true,
    templateUrl: "template/contacts.html",
    controller: function($scope){}
    }
})


//directive of shop
app.directive("shopBlock",function(){
    return{
    replace: true,
    templateUrl: "template/shop.html",
    controller: function($scope,$http,ngDialog){
            $scope.cakes = [];
            $scope.babychristen = [];
            $scope.firstItems = true;
            $scope.secondItems = true;
    
//get list of cakes
$http.get('http://localhost:8000/cakes') 
.then(function successCallback(response){
    $scope.cakes = response.data;
    },function errorCallback(response) {
        console.log("Error!!!" + response.err);
            }); 
    
//get list of babychristen
$http.get('http://localhost:8000/babychristen') 
.then(function successCallback(response){
    $scope.babychristen = response.data;
    },function errorCallback(response) {
        console.log("Error!!!" + response.err);
            });
 
        
$scope.birthday = function(){
    $scope.firstItems = true;
    $scope.secondItems = false;
}

$scope.babychristen = function(){
    $scope.secondItems = true;
    $scope.firstItems = false;    
}
// $scope.brandInform = false;
//        //get bag brand
//        $scope.checkBrand = function () {
//                let brandObj = {
//                    name: $scope.name
//                };
//               
//                     $http.post('http://localhost:8000/themecake-inf', brandObj)
//                    .then(function successCallback(response) {
//                         $scope.themecakeProfile = response.data;
//                         $scope.themecakeName = $scope.themecakeProfile[0].name;
//                         $scope.themecakeImage = $scope.themecakeProfile[0].image;
//                         $scope.brandInform = true;
//                         $scope.mainItems = false;
//                    },    
//                          function errorCallback(response) {
//                        console.log("Error!!!" + response.err);
//                    });
//            }
   
        
//ngDialog
//    $scope.buy = function (name, price) {
//        ngDialog.open({
//            template: '/template/newItem.html',
//            scope: $scope,
//            controller: function($scope){
//                
//            ngDialog.closeAll();
//      }
//  })
//        .closePromise.then(function(res){
//            $http.get('http://localhost:8000/items')
//            .then(function successCallback(response) {
//                $scope.items = response.data;
//           }, function errorCallback(response) {
//             console.log("Error!!!" + response.err);
//            }); 
//        });
//
//    }
        
   //

 
        
        //
        
      }
    }
})

