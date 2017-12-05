import {Component} from '@angular/core';

@Component({
    selector: 'footer',
    template: `
        <div class="container-fluid pico_total_footer" style="clear: both;position: relative;top: 50px;">
    <div class="container pico_footer" style="">
        <div class="picogram_footer_text col-xs-12 col-sm-9" style="padding:0px;">
            <span class="footer_list"></span>
            <span class="footer_list"></span>
            <span class="footer_list"></span>
            <span class="footer_list"></span>
            <span class="footer_list"></span>
            <span class="footer_list"></span>
            <span class="footer_list"></span>
            <span class="footer_list"></span>
            <span class="footer_list"></span>
        </div>
        <div class="picogram_footer col-xs-12 col-sm-3" style="text-align:right;padding:0px;">
            <span class="col-xs-12 footer_pico_2016" style="color: #999;"></span>
        </div>
    </div>
</div>`   

})
export class FooterComponent {

}