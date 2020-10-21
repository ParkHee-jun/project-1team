// var $tp = tickers[i].trade_price;
// var $change_rate = ((tickers[i].signed_change_rate*100).toFixed(2))
// var $high_price = tickers[i].high_price;
// var $low_price = tickers[i].low_price
// var $volume = ((tickers[i].acc_trade_price_24h>1000000 ? ( tickers[i].acc_trade_price_24h / 1000000 ) : tickers[i].acc_trade_price_24h ).toFixed(0)) + (tickers[i].acc_trade_price_24h>1000000 ? "백만" : "");

function comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
  }
  
  function setUpbitData(){
  $.ajax({
    url: "https://api.upbit.com/v1/market/all",
    dataType: "json"
  }).done(function(markets){
    //$("#tmp").html( JSON.stringify(markets) );
    var arr_krw_markets = "";
    var arr_english_name = [];
    var b = "KRW-BTC";
    var e = "KRW-ETH";
    var o = "KRW-EOS";
    var x = "KRW-XRP";

    for(var i = 0; i < markets.length; i++){
      if( markets[i].market.indexOf(b) > -1 ){
        arr_krw_markets += markets[i].market+(",");
        arr_english_name.push(markets[i].english_name.replace("",""));             
      }
      if( markets[i].market.indexOf(e) > -1 ){
        arr_krw_markets += markets[i].market+(",");
        arr_english_name.push(markets[i].english_name.replace("",""));      
      }
      if( markets[i].market.indexOf(o) > -1 ){
        arr_krw_markets += markets[i].market+(",");
        arr_english_name.push(markets[i].english_name.replace("",""));      
      }
      if( markets[i].market.indexOf(x) > -1 ){
        arr_krw_markets += markets[i].market+(",");
        arr_english_name.push(markets[i].english_name.replace("",""));      
      }
    }
    arr_krw_markets = arr_krw_markets.substring(0, arr_krw_markets.length-1);
    //$("#tmp").html( arr_krw_markets );
    $.ajax({
      url: "https://api.upbit.com/v1/ticker?markets=" + arr_krw_markets,
      dataType: "json"
    }).done(function(tickers){
      $('.col').remove();
      //alert($("#table_ticker > tbody > tr").length);       
    for(var i = 0; i < tickers.length; i++){
        var $tp = tickers[i].trade_price;
        var $change_rate = ((tickers[i].signed_change_rate*100).toFixed(2))
        var $high_price = tickers[i].high_price;
        var $low_price = tickers[i].low_price
        var $volume = ((tickers[i].acc_trade_price_24h>1000000 ? ( tickers[i].acc_trade_price_24h / 1000000 ) : tickers[i].acc_trade_price_24h ).toFixed(0)) + (tickers[i].acc_trade_price_24h>1000000 ? "백만" : "");
        
        var rowHtml = arr_english_name[i] 
        //rowHtml += "<td>" + arr_korean_name[i] +"</td>"

        // rowHtml += "<td>" + comma($tp) + " KRW</td>"
        // rowHtml += "<td>" + $change_rate + "%</td>"
        // rowHtml += "<td>" + comma($high_price) + " KRW</td>"
        // rowHtml += "<td>" + comma($low_price) + " KRW</td>"
        // rowHtml += "<td>" + comma($volume) + "</td>"
        // rowHtml += "</tr>";
        // $("#table_ticker > tbody:last").append(rowHtml); 

        //markets[i].korean_name
        $("#grid-widget ").append(`<div class="col">
        <a href="#" class="statistics-widget-link">
          <div class="statistics-widget-grid">
              <div class="content">
                  <h5>${rowHtml}/KRW</h5>
                  <h6>
                      <strong>${comma($tp)}</strong>
                  </h6>
                  <p> Volume :${comma($volume)}</p>
              </div>
              <span class="status red-color">${$change_rate}%</span>              
          </div>
        </a>
        </div>`);      
       } // end for...
    

    })  //done(function(tickers){
        

  }) // end done(function(markets){
      
  .fail(function(){
    //alert("업비트 API 접근 중 에러.")}
    $("#tmp").text( "API 접근 중 에러." );
  })
  setTimeout(setUpbitData, 13000);
  }
  $(function() {
  var color = localStorage.getItem("test_upbit_color");
  if( color ) $("#wrapper").css("color", color);
  setUpbitData();
  });