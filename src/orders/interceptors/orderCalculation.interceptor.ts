import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { FarmersService } from '../../farmers/farmers.service';
import { ProductsService } from '../../products/products.service';

@Injectable()
export class OrderCalculationInterceptor implements NestInterceptor {
  constructor(
    private farmersService: FarmersService,
    private productsService: ProductsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { farmerId, productDetails } = request.body;

    return from(this.farmersService.findOne(farmerId)).pipe(
      switchMap((farmer) => {
        if (!farmer) {
          return throwError(() => new NotFoundException('Farmer not found'));
        }

        const landSize = farmer.landSize;
        return from(this.productsService.findByIds(productDetails)).pipe(
          switchMap((products) => {
            if (products.length !== productDetails.length) {
              return throwError(
                () =>
                  new NotFoundException('One or more product IDs are invalid'),
              );
            }

            const errors = [];
            const updatedProducts = products.map((product) => {
              const quantityModifier = product.type === 'Fertilizer' ? 3 : 1;
              const calculatedQuantity = landSize * quantityModifier;
              const allowedQuantity =
                product.type === 'Fertilizer' ? landSize * 3 : landSize;

              if (calculatedQuantity > allowedQuantity) {
                errors.push(
                  `${product.type} quantity exceeds the allowed limit of ${quantityModifier} kg per acre for ${landSize} acres.`,
                );
              }

              // console.log('product');
              // console.log(Math.min(calculatedQuantity, allowedQuantity));

              return {
                product: product._id.toString(),
                quantity: Math.min(calculatedQuantity, allowedQuantity),
              };
            });

            if (errors.length > 0) {
              throw new BadRequestException(errors);
            }

            request.body.productDetails = updatedProducts;
            request.body.landSize = landSize;
            console.log(request.body);

            return next.handle();
          }),
        );
      }),
    );
  }
}
